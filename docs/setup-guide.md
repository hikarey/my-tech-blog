**Docker + Next.js + Rails API + PostgreSQLで個人開発の環境を作ってみた(つまずいたところまとめ)**

個人開発でサービスを作りたいと思い、Docker上にNext.js(フロントエンド)・Rails APIモード(バックエンド)・PostgreSQL(DB)の開発環境を構築しました。単に手順を並べるだけでなく、実際にやってみて詰まったポイントを中心に残しておきます。

構成
フロントエンド: Next.js(TypeScript, Tailwind CSS)
バックエンド: Rails(APIモード)
DB: PostgreSQL
すべてDocker Composeでまとめて起動
つまずいたポイント1: 空のGemfileだとRailsコマンドが使えない

rails newを実行する前に、Dockerイメージをビルドするための仮のGemfileをsource 'https://rubygems.org'だけで用意していたところ、railsコマンド自体が入っておらず、次のエラーが出ました。

/usr/bin/entrypoint.sh: line 6: exec: rails: not found

仮のGemfileにもgem 'rails'を明記しておく必要がありました。

つまずいたポイント2: rails newが自作のDockerfileを上書きする

rails new . --forceを実行すると、自分で用意していた開発用のDockerfileが、Railsが自動生成する「本番用」のDockerfileで上書きされてしまいました。WORKDIR /railsやRAILS_ENV=productionなど、ローカル開発には合わない内容だったため、元の開発用Dockerfileに書き戻しました。

つまずいたポイント3: create-next-appは空のフォルダにしか実行できない

Railsのrails new --forceとは違い、Next.jsのcreate-next-appは対象フォルダが空(または限られたファイルのみ)でないと実行できません。すでにDockerfileとentrypoint.shを置いていたため、エラーになりました。一度これらのファイルを退避させ、空のフォルダでcreate-next-appを実行してから、退避したファイルを戻す、という手順が必要でした。

つまずいたポイント4: Git BashのパスがDockerに正しく渡らない

Windows + Git Bashの組み合わせでdocker run -v $(pwd)/frontend:/app -w /app ...を実行したところ、/appがC:\Program Files\Git\appのようなWindowsパスに自動変換されてしまい、失敗しました。コマンドの先頭にMSYS_NO_PATHCONV=1を付けることで解決しました。

つまずいたポイント5: node_modulesを含めたままビルドすると失敗する

.dockerignoreを用意していなかったため、430MBのnode_modulesをそのままビルドコンテキストとして送ろうとして失敗しました。frontend/.dockerignoreにnode_modulesを追加して解決しました。

つまずいたポイント6: rails newがネストしたGitリポジトリを作る

rails new実行時に、backendフォルダの中に別の.gitが自動生成されており、ルートのmy-tech-blogリポジトリでgit add .をした際に「backend/ does not have a commit checked out」というエラーが出ました。backend/.gitを削除することで解決しました。

まとめ

一つ一つは検索すれば出てくるようなエラーですが、DockerとRailsとNext.jsを組み合わせると、こうした「定番の環境構築」でもいくつも壁にぶつかるものだと実感しました。同じ構成で作ろうとしている人の参考になれば幸いです。
