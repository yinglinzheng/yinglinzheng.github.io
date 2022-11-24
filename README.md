如果你在你的网站看到这个README，说明你的GITHUB pages是从master分支构建的，请切换到gh_pages分支

## Setup
下面的教程使用yourusername来表示你的github用户名

- 首先将此仓库导入到你的github账户中，仓库名设置为`yourusername.github.io`，这个仓库不能是private，否则无法启用pages服务
- 然后编辑`.github/workflows/vuepress-deploy.yml`，将其中的`yinglinzheng`替换为`yourusername`，大概长这样
```yml
name: Build and Deploy
on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@master

    - name: vuepress-deploy
      uses: jenkey2011/vuepress-deploy@master
      env:
        ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        TARGET_REPO: yourusername/yourusername.github.io
        TARGET_BRANCH: gh_pages
        BUILD_SCRIPT: yarn && yarn build
        BUILD_DIR: dist/

```

- 在仓库设置页面启用仓库的github actions功能
![图片](https://user-images.githubusercontent.com/89906355/203791726-f7aab2f6-eb99-44aa-85db-8ce6e0259baf.png)
- 在仓库设置界面启用仓库的pages功能，注意要选择从gh_pages分支进行构建，否则你的主页会显示为master分支的README，也就是本页面。
![图片](https://user-images.githubusercontent.com/89906355/203791483-ee4b2c83-8da0-4839-877f-9f37d12a7008.png)
- 创建个人访问token: 个人设置界面-> Developer settings > Personal access tokens > Generate new token > 至少选中repo下的项。然后你会得到一个token，找个什么地方记下来，下一步会用到。
- 在你的仓库设置界面->Secrets > 新建条目-> 名字为`ACCESS_TOKEN`，值为上一步创建的个人访问token。
- 在`docs/README.md`里随便修改点啥，触发一次commit和push
- 则应该会在github actions看到正在编译，master分支的代码经过编译后的产物会放到gh_pages分支，然后就会显示在你的github pages上了
![图片](https://user-images.githubusercontent.com/89906355/203791898-b699218c-4df9-4a90-b5fd-c9505fbbbfc8.png)







