'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class File extends Model {
    task(){
        return this.belongsTo('App/Models/Task')
    }
}

module.exports = File
