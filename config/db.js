import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `mongo db is connected succfully ${connect.connections[0].host}`.bgGreen
        .white
    );
  } catch (e) {
    console.log("something went wrong in db".bgRed.white);
  }
};
