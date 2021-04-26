# BinanceBot

## Important

This project is still in developement, and I won't take any responsibility for any loss you the bot might generate

------------

## Webserver

The webserver runs on port `8000` by default.

------------

## Routes

### GET
`/`
Returns the last 6 trades made by the bot (3 Buys, 3 Sells).

`/state`
Returns the bot state and pair it's targeting.

------------

### POST
`/botState`
Body example: 
```
{
"state": (true or false)
}
```
If successful, it will return the message `State written to file`

`/pair`
Body example: 
```
{
"pair": (valid crypto pair)
}
```
If successful, it will return the message `Pair written to file`

`/usdt`
Body example:
```
{
"usdt": (amount of USDT in string form)
}
```
If successful, it will return the message `Balance written to file`
