# ssh-deploy

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: hengkx/ssh-deploy@v1.0.0
  env:
    HOST: ${{ secrets.DEPLOY_HOST }}
    USERNAME: ${{ secrets.DEPLOY_USERNAME }}
    PASSWORD: ${{ secrets.DEPLOY_PASSWORD }}
    PORT: ${{ secrets.DEPLOY_PORT }}
    SOURCE: 'dist/'
    TARGET: ${{ secrets.DEPLOY_DEST_PATH }}
    AFTER_COMMAND: 'npm run stop && npm install --production && npm run start'
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
