# Express Playground

> The playground for Express.


## APIs


### GET `/_health`

Return HTTP status code 200.


### GET `/load`

Spawn a new thread to execute the heavy job asynchronously.

*Query*

| Key | Type | Constraint | Description |
|-----|------|------------|-------------|
| `x` | Number | Min: 1; Max: 5 | The factor to iterate the heavy job. "1" means 10^1 times, "2" means 10^2 times, etc. |


### POST `/logs/dummy`

Create a new dummy log.

*Body*

| Key | Type | Constraint | Description |
|-----|------|------------|-------------|
| `message` | String | | The log message. |


### GET `/logs/dummy`

Get all dummy logs.

