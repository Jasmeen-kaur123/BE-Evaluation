const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const server = http.createServer((req, res) => {
    let { method } = req;

    if (method == "GET") {
			if (req.url === "/") {
				fs.readFile("User.json", "utf8", (err, data) => {
					if (err) {
						console.log(err);
						res.writeHead(500);
						res.end("Server Error");
					} else {
						res.writeHead(200, { "Content-Type": "application/json" });
						res.end(data);
					}
				});
			} else if (req.url == "/allstudent") {
				fs.readFile("User.json", "utf8", (err, jsonData) => {
					if (err) {
						res.writeHead(500);
						res.end("Error reading students data");
						return;
					}

					const students = JSON.parse(jsonData);
						let studentTable = `
						<table border="1" style="width: 100%; border-collapse: collapse;">
							<thead>
								<tr>
									<th>First Name</th>
									<th>MiddleName</th>                                
									<th>Last Name</th>
									<th>D.O.B</th>
									<th>Gender</th>
									<th>Addres</th>
									<th>Email</th>
									<th>Mobile No.</th>
									<th>Phone No.</th>
									<th>University</th>
									<th>Course</th>
								</tr>
							</thead>
						<tbody>`;
					
						students.forEach(student => {
							studentTable += `
								<tr>
									<td>${student.first_name}</td>
									<td>${student.middle_name}</td>
									<td>${student.last_name}</td>
									<td>${student.birth_date},${student.day},${student.year}</td>
									<td>${student.Gender}</td>
									<td>${student.street_address},${student.city},${student.state},${student.zip}</td>
									<td>${student.email}</td>
									<td>${student.mobile}</td>
									<td>${student.phone_number}</td>
									<td>${student.university}</td>
									<td>${student.course}</td>
								</tr>`;
						});
				
						studentTable += `
									</tbody>
							</table>
						`;
						res.writeHead(200, { "Content-Type": "text/html" });
						res.end(studentTable);
					});
      } else if (req.url === "/register") {
				fs.readFile("register.html", "utf8", (err, data) => {
						if (err) {
								res.writeHead(500);
								res.end("Server Error");
						} else {
								console.log("sending register.html file");
								res.end(data);
						}
				});
      } else{
				console.log(req.url);  
				res.writeHead(404);
				res.end("Not Found");
      }
    } else {
			if (req.url === "/register") {
				let body = "";
				req.on("data", (chunk) => {
					body += chunk.toString();
				});
				
				req.on("end", () => {
					let readdata = fs.readFileSync("User.json", "utf-8"); //data stored in string type
		
					if (!readdata) {  // if file is empty add an empty array
						fs.writeFileSync("User.json", JSON.stringify([]));
					} else {      //if file have already some data
						let jsonData = JSON.parse(readdata);
						let users = [...jsonData];
						console.log(users);

						let convertedbody = qs.decode(body);
						users.push(convertedbody);
						fs.writeFile("User.json", JSON.stringify(users), (err) => {
							if (err) {
								console.log(err);
							} else {
								console.log("userdata inserted succefuly");
							}
						});
					}

					res.writeHead(200, { "Content-Type": "text/html" });
					res.end("Registration successful!");
				});
			}
    }
});

server.listen(3000,() => {
    console.log("Server listening on port 3000");
});
