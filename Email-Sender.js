import nodemailer from "nodemailer";
import userModel from "./src/models/userModel.js";

export const getAttendance = async () => {
  try {
    const requestedDate = new Date("2023-06-19");

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
                Date: requestedDate,
              },
            },
          ],
          as: "attendances",
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          userId: 1,
          Department: 1,
          attendances: 1,
        },
      },
      {
        $unwind: {
          path: "$attendances",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    //   console.log(users);
    console.log("requestedDate:", requestedDate);
    if (users.length > 0) {
      sendEmail(users);
      console.log(users);
    } else {
      console.log("No users found.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const sendEmail = (users) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "darpanbari056@gmail.com",
      pass: "hdqzfbyscgarokmv",
    },
  });

  const tableData = `
  <table style="border-collapse: collapse; width: 100%; border: 1px solid black;">
    <thead style="background: #A1C2F1;">
      <tr>
        <th style="border: 1px solid black; padding: 8px;">First Name</th>
        <th style="border: 1px solid black; padding: 8px;">Last Name</th>
        <th style="border: 1px solid black; padding: 8px;">InTime</th>
        <th style="border: 1px solid black; padding: 8px;">OutTime</th>
        <th style="border: 1px solid black; padding: 8px;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${users
        .map(
          (user) => `
        <tr>
          <td style="border: 1px solid black; padding: 8px;">${user.firstName}</td>
          <td style="border: 1px solid black; padding: 8px;">${user.lastName}</td>
          <td style="border: 1px solid black; padding: 8px;">${user.attendances ? user.attendances.intime : "----"}</td>
          <td style="border: 1px solid black; padding: 8px;">${user.attendances ? user.attendances.outtime : "----"}</td>
          <td style="border: 1px solid black; padding: 8px;">${user.attendances ? user.attendances.status : "ABSENT"}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
`;

  const mailOptions = {
    from: "darpanbari056@gmail.com",
    to: "darpanbari084@gmail.com",
    subject: "Attendance Report",
    text: "Email In Table Formate",
    html: `${tableData}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
