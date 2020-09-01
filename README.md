# N-MongoDB (FiveM)

_MongoDB wrapper for use within FiveM_

A typescript implementation of a MongoDB wrapper for use within FiveM. Completely written in typescript, exporting 
functions to easily access and manipulate a Mongo database. Adapted from [@alcoholiclobster](https://github.com/alcoholiclobster)'s 
[fivem-mongodb](https://github.com/alcoholiclobster/fivem-mongodb), but rewritten in Typescript to be modular, and type safe.

## Installation
* Clone the library, update NPM, and build:
    ```
    git clone https://github.com/SkinnyPeteTheGiraffe/n-mongodb.git n-mongodb
    cd n-mongodb
    yarn install
    yarn run build
    ```
* Create a `database.cfg` and place it within your server root directory.
  * Add the following lines to the `database.cfg` file (do not include <>):
      ```cfg
        set mongodb_host <REPLACE_WITH_MONGO_HOST>
        set mongodb_collection <REPLACE_WITH_MONGO_COLLECTION_NAME>
      ```
* At the top of your `server.cfg` include (before `ensure`):
    ```cfg
    exec "database.cfg"
    ```
* Include the library in your `server.cfg`:
    ```cfg
    ensure mongodb
    ```
## Usage Examples
##### Original Example (Lua):
```lua
exports.mongodb:findOne({ collection = "users", query = { _id = id } }, function (success, result)
    if not success then
        print("Error message: "..tostring(result))
        return
    end
    print("User name is "..tostring(result[1].name))
end)
```

##### Example (JS/TS)
```js
exports.mongodb.findOne({ collection: "users", query: { _id: id } }, (success, result) => {
    if (!success) {
        console.log(`Error message: ${result}`)
        return
    }
    console.log(`User name is ${result[1].name}`)
})
```
