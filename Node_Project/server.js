var express = require("express");
var mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");
// const { CLIENT_RENEG_LIMIT } = require("tls");
let app = express();
app.use(express.static("public"));
app.use(express.urlencoded(true));
app.use(fileuploader());
app.listen(1350, function () {
    console.log("Server Started Ji :-) ")
})
//----------------------Connecting Database----------------------
let config = {
    host: "127.0.0.1",
    user: "root",
    password: "Tanishque23",
    database: "project",
    dateStrings: true
}
var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null) {
        console.log("Connected to Database Successfully !!");
    }else {
        console.log(err.message + "iludbc");
    }
})
//--------------------------------------------------
app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);
})

app.get("/user-signup", function (req, resp) {
    // console.log(req.query);
    mysql.query("insert into users(email,pwd,utype) values (?,?,?)", [req.query.txtsemail, req.query.txtspwd, req.query.typesselect], function (err) {
        if (err == null) {
            console.log("Bahut Bahut Badhaii !!");
            resp.send("SignUp Successfull");
        }else {
            console.log(err.message + "iludbsi");
            resp.send(err.message);
        }
    })
})

app.get("/user-login", function (req, resp) {
    // console.log(req.query);
    mysql.query("select * from users where email=? and pwd=?", [req.query.txtlemail, req.query.txtlpwd], function (err, result) {
        if (err == null) {
            if (result.length == 0) {
                resp.send("Invalid Email or Password");
            }
            else if (result[0].status == 1) {
                resp.send(result[0]);
            }
            else {
                resp.send("Sorry, you are blocked");
            }
        }
        else {
            resp.send(err.message + "ilu");
        }
    })
})
// app.get("/infl-dashboard", function (req, resp) {
//     let path = __dirname + "/public/infl-dash.html";
//     resp.sendFile(path);
// })
// app.get("/inf-find", function (req, resp) {
//     let path = __dirname + "/public/infl-finder.html";
//     resp.sendFile(path);
// })
app.get("/client-pro", function (req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
})


app.get("/influencer-profile", function (req, resp) {

    let path = __dirname + "/public/inf-profile.html";
    resp.sendFile(path);
})

app.get("/infl-bookings", function (req, resp) {
    // console.log(req.query);
    mysql.query("insert into events(emailid,events,doe,tos,city,venue) values(?,?,?,?,?,?)", [req.query.txtpbemail, req.query.txtpbevent, req.query.txtpbdate, req.query.txtpbtime, req.query.txtpbcity, req.query.txtpbvenue], function (err) {
        if (err == null)
            resp.send("Event Booked");
        else
            resp.send(err.message);
    })
})

app.get("/infl-settings", function (req, resp) {
    console.log(req.query);
    let email = req.query.txtsettingsemail;
    let str = "";
    mysql.query("select pwd from users where email=?", [email], function (err, jsonAry) {
        if (err == null) {
            console.log("Congratulations");
        }
        else
            console.log(err.message);

        if (jsonAry.length == 0) {
            console.log("Incorrect Email")
        }
        else if (jsonAry.length == 1) {
            if (jsonAry[0].pwd != req.query.txtoldpwd) {
                console.log("Incorrect Password");
            }

            if (req.query.txtnewpwd == req.query.txtconfirmpwd) {
                console.log("Password being Updated");

                mysql.query("update users set pwd=? where email=?", [req.query.txtnewpwd, email], function (err) {
                    if (err == null)
                        resp.send("Password Updates")
                    else
                        resp.send(err.message);
                })
            }
            else {
                console.log("Try Again");
            }
        }
    })

})

app.get("/search-details", function (req, resp) {
    // console.log("Problem");
    let email = req.query.txtemailinf;
    mysql.query("select * from iprofile where email=?", [email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);
    })
})

app.get("/admin-dashboard", function (req, resp) {

    let path = __dirname + "/public/admin-dash.html";
    resp.sendFile(path);

})

app.get("/adminusers", function (req, resp) {

    let path = __dirname + "/public/admin-users.html";
    resp.sendFile(path);

})

app.get("/adminallinf", function (req, resp) {

    let path = __dirname + "/public/admin-all-infl.html";
    resp.sendFile(path);

})

app.get("/fetch-all-infl", function (req, resp) {
    // console.log("Hello");
    mysql.query("select * from iprofile", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})

app.get("/fetch-all-users", function (req, resp) {
    let person="admin";
    mysql.query("select * from users where utype!=?",[person], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})

app.get("/del-one", function (req, resp) {
    mysql.query("delete from users where email=?", [req.query.email], function (err, reuslt) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("Deleted");
    })
})

app.get("/block-one", function (req, resp) {
    mysql.query("update users set status=0 where email=?", [req.query.email], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("Blocked");
    })
})

app.get("/resume-one", function (req, resp) {
    mysql.query("update users set status=1 where email=?", [req.query.email], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("Resumed");
    })
})

app.get("/fetch-all-cities", function (req, resp) {

    mysql.query("select distinct cities from iprofile where fields like %?%", ["%" + req.query.fields + "%"], function (err, JSONarycities) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result.JSONarycities);
    })
})


app.get("/do-find", function (req, resp) {
    const { fields, city, gender } = req.query;

    let query = "SELECT * FROM iprofile WHERE 1=1";
    let params = [];

    if (fields && fields.trim()) {
        query += " AND fields LIKE ?";
        params.push(`%${fields}%`);
    }

    if (city && city.trim()) {
        query += " AND city LIKE ?";
        params.push(`%${city}%`);
    }

    if (gender && gender.trim()) {
        query += " AND gender = ?";
        params.push(gender);
    }

    mysql.query(query, params, (err, resultJSON) => {
        if (err) {
            resp.status(500).send(err.message);
        } else {
            resp.status(200).send(resultJSON);
        }
    });
});



app.get("/searchclient-details", function (req, resp) {
    let cemail = req.query.CPemailinf;
    mysql.query("select * from cprofile where email=?", [cemail], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);
    })
})

app.post("/client-save", function (req, resp) {

    console.log(req.body);
    mysql.query("insert into cprofile values(?,?,?,?,?,?)", [req.body.CPemailinf, req.body.CPnameinf, req.body.CPcityinf, req.body.CPstateinf, req.body.CPorginf, req.body.CPmobinf], function (err) {
        if (err == null)
            resp.send("Bahut Bahut Badhai.....");
        else
            resp.send(err.message);
    })
})

app.post("/client-update", function (req, resp) {
    console.log(req.body);
    mysql.query("update cprofile set name=?,city=?,state=?,org=?,mobile=? where email=?", [req.body.CPnameinf, req.body.CPcityinf, req.body.CPstateinf, req.body.CPorginf, req.body.CPmobinf, req.body.CPemailinf], function (err) {
        if (err == null)
            resp.send("Entry Updated");
        else
            resp.semd(err.message);
    })
})

// app.post("/influencer-update", function (req, resp) {
//     let fileName = "";
//     req.body.photo = fileName;
//     console.log(req.body);
//     mysql.query("update iprofile set iname=?,gender=?,dob=?,address=?,city=?, contact=?,fields=?,insta=?,fb=?, youtube=?, otheri=?,picpath=? where email=?", [req.body.txtnameinf, req.body.txtgenderinf, req.body.dobinf, req.body.txtaddinf, req.body.txtcityinf, req.body.txtphninf, req.body.listcategoryi.toString(), req.body.txtinstainf, req.body.txtlinkedinf, req.body.txtyoutubeinf, req.body.txtotherinfoi, fileName, req.body.txtemailinf], function (err) {
//         if (err == null)
//             resp.send("Entry Updated");
//         else
//             resp.semd(err.message);
//     })
// })


const path = require('path');
const fs = require('fs');

// app.post("/influencer-update", function (req, resp) {
//     // Check if a file was uploaded
//     let fileName = req.body.hdn; // Default to the existing file name (hidden field value)
//     if (req.files && req.files.photo) {
//         const file = req.files.photo;
//         fileName = Date.now() + path.extname(file.name); // Generate unique file name
//         const uploadPath = path.join(__dirname, 'public/uploads', fileName);

//         // Move the file to the 'uploads' folder
//         file.mv(uploadPath, function (err) {
//             if (err) {
//                 return resp.status(500).send("File upload failed: " + err.message);
//             }
//         });
//     }

//     // Update the database
//     mysql.query(
//         "UPDATE iprofile SET iname=?, gender=?, dob=?, address=?, city=?, contact=?, fields=?, insta=?, fb=?, youtube=?, otheri=?, picpath=? WHERE email=?",
//         [
//             req.body.txtnameinf,
//             req.body.txtgenderinf,
//             req.body.dobinf,
//             req.body.txtaddinf,
//             req.body.txtcityinf,
//             req.body.txtphninf,
//             req.body.listcategoryi.toString(),
//             req.body.txtinstainf,
//             req.body.txtlinkedinf,
//             req.body.txtyoutubeinf,
//             req.body.txtotherinfoi,
//             fileName,
//             req.body.txtemailinf
//         ],
//         function (err) {
//             if (err) {
//                 resp.status(500).send("Database update failed: " + err.message);
//             } else {
//                 resp.send("Entry Updated Successfully");
//             }
//         }
//     );
// });

// app.post("/influencer-save", function (req, resp) {

//     let fileName = "";
//     if (req.files != null) {
//         fileName = req.files.photo.name;
//         let path = __dirname + "/public/uploads/" + fileName;
//         req.files.photo.mv(path);
//     }
//     else
//         fileName = "nopic.jpg";

//     req.body.photo = fileName;
//     console.log(req.body);
//     // console.log(req.fileName);

//     mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.txtemailinf, req.body.txtnameinf, req.body.txtgenderinf, req.body.dobinf, req.body.txtaddinf, req.body.txtcityinf, req.body.txtphninf, req.body.listcategoryi.toString(), req.body.txtinstainf, req.body.txtlinkedinf, req.body.txtyoutubeinf, req.body.txtotherinfoi, fileName], function (err) {
//         if (err == null)
//             resp.send("Bahut Bahut Badhai.....");
//         else
//             resp.send(err.message);
//     })
// })


app.post("/influencer-update", function (req, resp) {
    // Default to the hidden field value (existing picture path)
    let fileName = req.body.hdn;

    // Check if a new picture is uploaded
    if (req.files && req.files.photo) {
        const file = req.files.photo;
        fileName = Date.now() + path.extname(file.name); // Generate unique file name
        const uploadPath = path.join(__dirname, "public/uploads", fileName);

        // Move the uploaded file
        file.mv(uploadPath, function (err) {
            if (err) {
                return resp.status(500).send("File upload failed: " + err.message);
            }
        });
    } else {
        // Query to fetch the existing image name from the database
        mysql.query(
            "SELECT picpath FROM iprofile WHERE email = ?",
            [req.body.txtemailinf],
            function (err, results) {
                if (err) {
                    return resp.status(500).send("Error fetching image: " + err.message);
                }

                // If an image exists in the database, use it; otherwise, default to nopic.jpg
                fileName = results.length > 0 && results[0].picpath ? results[0].picpath : "nopic.jpg";
            }
        );
    }

    // Update query to modify the influencer's profile
    mysql.query(
        "UPDATE iprofile SET iname=?, gender=?, dob=?, address=?, city=?, contact=?, fields=?, insta=?, fb=?, youtube=?, otheri=?, picpath=? WHERE email=?",
        [
            req.body.txtnameinf,
            req.body.txtgenderinf,
            req.body.dobinf,
            req.body.txtaddinf,
            req.body.txtcityinf,
            req.body.txtphninf,
            req.body.listcategoryi.toString(),
            req.body.txtinstainf,
            req.body.txtlinkedinf,
            req.body.txtyoutubeinf,
            req.body.txtotherinfoi,
            fileName,
            req.body.txtemailinf,
        ],
        function (err) {
            if (err) {
                resp.status(500).send("Database update failed: " + err.message);
            } else {
                resp.send("Profile updated successfully!");
            }
        }
    );
});


app.post("/influencer-save", function (req, resp) {
    let fileName = "nopic.jpg";

    // Check if a file was uploaded
    if (req.files && req.files.photo) {
        const file = req.files.photo;
        fileName = Date.now() + path.extname(file.name); // Generate unique file name
        const uploadPath = path.join(__dirname, "public/uploads", fileName);

        // Move the file to the 'uploads' folder
        file.mv(uploadPath, function (err) {
            if (err) {
                return resp.status(500).send("File upload failed: " + err.message);
            }
        });
    }

    // Insert data into the database
    mysql.query(
        "INSERT INTO iprofile VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
            req.body.txtemailinf,
            req.body.txtnameinf,
            req.body.txtgenderinf,
            req.body.dobinf,
            req.body.txtaddinf,
            req.body.txtcityinf,
            req.body.txtphninf,
            req.body.listcategoryi.toString(),
            req.body.txtinstainf,
            req.body.txtlinkedinf,
            req.body.txtyoutubeinf,
            req.body.txtotherinfoi,
            fileName,
        ],
        function (err) {
            if (err) {
                resp.status(500).send(err.message);
            } else {
                resp.send("Profile saved successfully!");
            }
        }
    );
});



app.get("/events-manager", function (req, resp) {
    let path = __dirname + "/public/events-manager.html";
    resp.sendFile(path);
})

// app.get("/fetch-all-events", function (req, resp) {
//     console.log("hii")
//     mysql.query("select * from events where emailid=?", [req.query.Eventstxtemail], function (err, result) {
//         if (err != null) {
//             resp.send(err.message);
//             return;
//         }
//         console.log("hello");
//         resp.send(result);
//     })
// })

app.get("/fetch-all-events", function (req, resp) {
    mysql.query("select * from events where emailid=?", [req.query.email], function (err, result) {
        // console.log("Hello Ilu");
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})

// app.get("/fetchbyMailsID", function (req, resp) {
//     let email = req.query.email;
//     if (!email) {
//         resp.status(400).send("Email ID is required.");
//         return;
//     }
//     mysql.query(
//         "SELECT * FROM events WHERE emailid = ?",
//         [email],
//         function (err, result) {
//             if (err) {
//                 resp.status(500).send(err.message);
//                 return;
//             }
//             resp.send(result);
//         }
//     );
// });


app.get("/fetch-one-events", function (req, resp) {
    mysql.query("select * from events", [], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})

app.get("/del-one-events", function (req, resp) {
    mysql.query("delete from events where rid=?", [req.query.rid], function (err, reuslt) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("Completed");
    })
})

app.get("/user-forgotpwd",function(req,resp)
{
    mysql.query("select * from users where email=?",[req.query.txtlemail],function(err,result){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})

// app.get("/forgot-pwd",function(req,resp)
// {
//     console.log(req.query);
//     // mysql.query("select * from users where email=?",[req.query.txtemail],function(err,result){
//     //     if(err!=null){
//     //         resp.send("Hello");
//     //     }
//     //     resp.send("Error");
//     // })
// })

const nodemailer = require("nodemailer");

// Set up nodemailer transporter using app password
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "testnodeproject1@gmail.com", // Your email address
        pass: "pcft vmpd hstc vnhy",   // App password generated from Google
    },
});

app.get("/forgot-pwd", function (req, resp) {
    const email = req.query.txtemail;
    if (!email) {
        return resp.status(400).send("Email is required");
    }
    mysql.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
        if (err) {
            console.error("Database error:", err);
            return resp.status(500).send("Database error: " + err.message);
        }
        if (result.length === 0) {
            return resp.status(404).send("No user found with this email.");
        }
        const opwd = result[0].pwd; // Assuming `pwd` is the column name in your table
        const mailOptions = {
            from: "testnodeproject1@gmail.com",
            to: email,
            subject: "Forgot Password",
            text: "Your original password is: " + opwd,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Error sending email:", error);
                return resp.status(500).send("Error sending email: " + error.message);
            } else {
                console.log("Email sent:", info.response);
                return resp.send("Email sent successfully to " + email);
            }
        });
    });
});
