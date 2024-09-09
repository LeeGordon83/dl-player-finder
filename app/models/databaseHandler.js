const mongoose = require('mongoose')

class DatabaseHandler {
  constructor (uri) {
    this.uri = uri
  }

  // Connect to MongoDB
  async connect () {
    try {
      await mongoose.connect(this.uri, { useNewUrlParser: true, useUnifiedTopology: true })
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Failed to connect to MongoDB', error)
      throw error
    }
  }

  // Disconnect from MongoDB
  async disconnect () {
    try {
      await mongoose.disconnect()
      console.log('Disconnected from MongoDB')
    } catch (error) {
      console.error('Failed to disconnect from MongoDB', error)
      throw error
    }
  }

  // Insert data into a specific collection/model
  async insertData (Model, data) {
    try {
      const result = await Model.insertMany(data)
      console.log('Data inserted successfully:', result)
      return result
    } catch (error) {
      console.error('Failed to insert data:', error)
      throw error
    }
  }

  // Retrieve data from a specific collection/model based on a query
  async getData (Model, query = {}) {
    try {
      const result = await Model.find(query)
      console.log('Data retrieved successfully:', result)
      return result
    } catch (error) {
      console.error('Failed to retrieve data:', error)
      throw error
    }
  }

  // Update data in a specific collection/model based on a query
  async updateData (Model, query, update) {
    try {
      const result = await Model.updateMany(query, update)
      console.log('Data updated successfully:', result)
      return result
    } catch (error) {
      console.error('Failed to update data:', error)
      throw error
    }
  }

  // Insert or update data
  async insertOrUpdateData (Model, goalscorers) {
    for (const goalscorer of goalscorers) {
      const { id, ...data } = goalscorer

      try {
        // Check if the document already exists by 'id'
        const existingDocument = await Model.findOne({ id })

        if (existingDocument) {
          // Compare and update only if data has changed
          const hasChanged = Object.keys(data).some(
            key => existingDocument[key] !== data[key]
          )

          if (hasChanged) {
            await Model.updateOne({ id }, { $set: data })
            console.log(`Updated goalscorer with id: ${id}`)
          } else {
            console.log(`No changes for goalscorer with id: ${id}`)
          }
        } else {
          // Insert new document if it doesn't exist
          await new Model(goalscorer).save()
          console.log(`Inserted new goalscorer with id: ${id}`)
        }
      } catch (error) {
        console.error(`Error updating or inserting goalscorer with id: ${id}`, error)
      }
    }
  }

  // Delete data from a specific collection/model based on a query
  async deleteData (Model, query) {
    try {
      const result = await Model.deleteMany(query)
      console.log('Data deleted successfully:', result)
      return result
    } catch (error) {
      console.error('Failed to delete data:', error)
      throw error
    }
  }
}

module.exports = DatabaseHandler
