import xlsx from "xlsx";
import nodemailer from "nodemailer";
import userModel from "./src/models/userModel.js";
import moment from "moment"

export const getAttendanceExcel = async () => {
  try {
    const requestedDate = moment().format("YYYY-MM-DD");

    const users = await userModel.aggregate([
      {
        $project: {
          firstName: 1,
          lastName: 1,
          userId: 1,
          department: 1,
        },
      },
      {
        $lookup: {
          from: "attendances",
          localField: "_id",
          foreignField: "employeeId",
          pipeline: [
            {
              $match: {
                Date: new Date(requestedDate),
              },
            },
          ],
          as: "attendances",
        },
      },
      {
        $unwind: {
          path: "$attendances",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          firstName: 1,
          lastName: 1,
          userId: 1,
          department: 1,
          // Date: "$attendances.Date",
          Date: {
            $ifNull: [{ $dateToString: { format: "%Y-%m-%d", date: "$attendances.Date" }}, `${requestedDate}`],
          },
          inTime: {
            $ifNull: [{ $dateToString: { format: "%H:%M:%S", date: "$attendances.inTime" }}, "--A--"],
          },
          outTime: {
            $ifNull: [{ $dateToString: { format: "%H:%M:%S", date: "$attendances.outTime" }}, "--A--"],
          },
          status: {
            $ifNull: ["$attendances.status", "--A--"],
          },
        },
      },
    ]);

    if (users.length > 0) {
      console.log(users)
      const workBook = xlsx.utils.book_new();
      const workSheet = xlsx.utils.json_to_sheet(users);
      xlsx.utils.book_append_sheet(workBook, workSheet);

      const filePath = "convertedFile.xlsx";
      xlsx.writeFile(workBook, filePath);

      sendEmail(filePath);
    } else {
      console.log("No users found.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const sendEmail = (filePath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "darpanbari056@gmail.com",
      pass: "hdqzfbyscgarokmv",
    },
  });

  const mailOptions = {
    from: "darpanbari056@gmail.com",
    to: "darpanbari084@gmail.com", //chiragprajapati781@gmail.com
    subject: "Attendance Report",
    text: "Please find the attendance report attached.",
    attachments: [
      {
        filename: "convertedFile.xlsx",
        path: filePath,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// getAttendanceExcel();
