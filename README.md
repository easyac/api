[![CodeFactor](https://www.codefactor.io/repository/github/easyac/api/badge)](https://www.codefactor.io/repository/github/easyac/api)

## Start

Clone and run [easyac/worker](https://github.com/easyac/workers). It is a dependency.

So start this project with Makefile task `make docker-run`.

## Routes

|VERB|ROUTE|DESCRIPTION|
|---|---|---|
|`POST`|**/user**| Create User |
|`POST`|**/user/auth**| Authenticate User |
|`POST`|**/user/revalidate**| Revalidate User Auth |
|`POST`|**/senac/associate**| Associate Senac Login with user |
|`POST`|**/senac/login**| Login in Senac Portal |
|`POST`|**/senac/sync**| Ask EasyacBOT for sync Senac data |
|`POST`|**/senac/sync/status**| Look at status sync |
|`GET`|**/class**| Retrieve student classes |
