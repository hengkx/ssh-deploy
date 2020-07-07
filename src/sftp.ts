import * as path from 'path';
import * as fs from 'fs';
import { Client, SFTPWrapper } from 'ssh2';
import { Stats } from 'ssh2-streams';

class Sftp {
  conn: Client;
  sftp: SFTPWrapper | undefined;
  constructor(conn: Client) {
    this.conn = conn;
  }

  private getSftp(): Promise<SFTPWrapper> {
    if (this.sftp) {
      return Promise.resolve(this.sftp);
    }
    return new Promise((resolve, reject) => {
      this.conn.sftp((err, sftp) => {
        if (err) return reject(err);
        this.sftp = sftp;
        resolve(sftp);
      });
    });
  }

  async fastPut(localPath: string, remotePath: string) {
    const sftp = await this.getSftp();
    return new Promise((resolve, reject) => {
      sftp.fastPut(localPath, remotePath, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async mkdir(path: string) {
    const sftp = await this.getSftp();
    return new Promise((resolve, reject) => {
      sftp.mkdir(path, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async stat(path: string): Promise<Stats> {
    const sftp = await this.getSftp();
    return new Promise((resolve, reject) => {
      sftp.stat(path, (err, stats) => {
        if (err) return reject(err);
        resolve(stats);
      });
    });
  }

  async exists(path: string): Promise<boolean> {
    const sftp = await this.getSftp();
    return new Promise((resolve, reject) => {
      sftp.exists(path, res => {
        resolve(res);
      });
    });
  }

  async uploadDir(localPath: string, remotePath: string) {
    const stat = fs.statSync(localPath);
    if (stat.isFile()) {
      await this.fastPut(localPath, remotePath);
    } else if (stat.isDirectory()) {
      if (!(await this.exists(remotePath))) {
        await this.mkdir(remotePath);
      }
      const dirs = fs.readdirSync(localPath);
      for (const name of dirs) {
        await this.uploadDir(
          path.join(localPath, name),
          path.join(remotePath, name)
        );
      }
    }
  }
}

export default Sftp;
