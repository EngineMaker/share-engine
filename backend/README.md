## How to use?

サーバーを起動

```
docker compose up
```

サーバーを起動すると[APIドキュメント](http://localhost:8000/docs)が参照できます。

## APIスキーマ

サーバーを起動して以下を実行するとスキーマファイルがダウンロードできます。  
ブラウザで http://localhost:8000/openapi.json を開いてもOKです。

```
curl http://localhost:8000/openapi.json -o openapi.json
```

サーバーを起動せずに出力することもできます（スクリプトから出力する用）

```
docker compose run api scripts/generate.sh
```

`out`フォルダに出力されます
