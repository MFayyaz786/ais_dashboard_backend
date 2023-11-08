const { default: mongoose } = require("mongoose");
const projection = require("../db/projection");
const clientModel = require("../model/clientModel");
const pocModel = require("../model/pocModel");

const clientServices = {
  addNew: async (
    name,
    company,
    email,
    contact,
    address,
    country,
    city,
    website,
    poc
  ) => {
    const data = new clientModel({
    name,
    company,
    email,
    contact,
    address,
    country,
    city,
    website,
    });
    
    // create poc
    const data2=new pocModel({
      name:poc.name,
      email:poc.email,
      contact:poc.contact
    })

    data.poc.unshift(data2._id)
    
    await data2.save()
    await data.save()

    const result = await data.save();

    await clientModel.populate(data, {path: "poc"});

    return result;
  },

  // get 
  get: async () => {
  const result = await clientModel
    .find({}, projection.projection)
    // .populate({
    //   path: "poc",
    // })
    // .populate({
    //   path: "Project",
    // })
    .lean();
    return result;
  },

  getClient: async (id) => {
  const result = await clientModel.findById(id)
    return result;
  },



//  update 

  update: async (body,params) => {
    const {
      name,
      company,
      email,
      contact,
      address,
      country,
      city,
      website,
      poc
    }=body
    const {id}=params
    
    const result = await clientModel.findOneAndUpdate(
      { _id: id },
      {
      name,
      company,
      email,
      contact,
      address,
      country,
      city,
      website,
      poc
      },
      {runValidators:true,new:true}
    );
    return result;
  },

  delete: async (id) => {
    const result = await clientModel.findByIdAndDelete(id);
    return result;
  },

};

module.exports = clientServices;
