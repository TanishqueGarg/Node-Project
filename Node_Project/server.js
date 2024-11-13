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

//----------Connecting Database--------------

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
    }
    else {
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
        }

        else {
            console.log(err.message + "iludbsi");
            resp.send(err.message);
        }

    })

})


app.get("/user-login", function (req, resp) {

    // console.log(req.query);

    mysql.query("select status,utype from users where email=? and pwd=?", [req.query.txtlemail, req.query.txtlpwd], function (err, result) {

        if (err == null) {
            if (result.length == 0) {
                resp.send("Invalid Email or Password");
            }
            else if (result[0].status == 1) {
                resp.send("Logged In Successfully  " + result[0].utype);

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

app.get("/infl-dashboard", function (req, resp) {

    let path = __dirname + "/public/infl-dash.html";
    resp.sendFile(path);

})

app.get("/inf-find", function (req, resp) {
    let path = __dirname + "/public/infl-finder.html";
    resp.sendFile(path);
})

app.get("/client-pro", function (req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
})


app.get("/influencer-profile", function (req, resp) {

    let path = __dirname + "/public/inf-profile.html";
    resp.sendFile(path);
})

app.post("/influencer-save", function (req, resp) {

    let fileName = "";
    if (req.files != null) {
        fileName = req.files.photo.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.photo.mv(path);
    }
    else
        fileName = "nopic.jpg";

    req.body.photo = fileName;
    console.log(req.body);
    // console.log(req.fileName);

    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.txtemailinf, req.body.txtnameinf, req.body.txtgenderinf, req.body.dobinf, req.body.txtaddinf, req.body.txtcityinf, req.body.txtphninf, req.body.listcategoryi.toString(), req.body.txtinstainf, req.body.txtlinkedinf, req.body.txtyoutubeinf, req.body.txtotherinfoi, fileName], function (err) {
        if (err == null)
            resp.send("Bahut Bahut Badhai.....");
        else
            resp.send(err.message);
    })

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
    mysql.query("select * from users", function (err, resultJsonAry) {
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
    mysql.query("select * from iprofile where fields like ?", ["%" + req.query.fields + "%"], function (err, resultJSON) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultJSON);
    })
})

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

app.post("/influencer-update", function (req, resp) {
    let fileName = "";
    req.body.photo = fileName;
    console.log(req.body);
    mysql.query("update iprofile set iname=?,gender=?,dob=?,address=?,city=?, contact=?,fields=?,insta=?,fb=?, youtube=?, otheri=?,picpath=? where email=?", [req.body.txtnameinf, req.body.txtgenderinf, req.body.dobinf, req.body.txtaddinf, req.body.txtcityinf, req.body.txtphninf, req.body.listcategoryi.toString(), req.body.txtinstainf, req.body.txtlinkedinf, req.body.txtyoutubeinf, req.body.txtotherinfoi, fileName, req.body.txtemailinf], function (err) {
        if (err == null)
            resp.send("Entry Updated");
        else
            resp.semd(err.message);
    })
})

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
    mysql.query("select * from events", [], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})

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