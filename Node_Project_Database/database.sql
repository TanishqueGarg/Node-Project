use project;
create table users(email varchar(30) primary key,pwd varchar(30),utype varchar(30),status int null default 1);
select * from users;
insert into users(email,pwd,utype) values('tanishque@gmail.com','12345','client');

select status,utype from users where email='tanu@gmail.com' and pwd='23';

CREATE TABLE `project`.`iprofile` (
  `email` VARCHAR(30) NOT NULL,
  `iname` VARCHAR(45) NULL,
  `gender` VARCHAR(45) NULL,
  `dob` DATE NULL,
  `address` VARCHAR(100) NULL,
  `city` VARCHAR(45) NULL,
  `contact` VARCHAR(10) NULL,
  `fields` VARCHAR(50) NULL,
  `insta` VARCHAR(45) NULL,
  `fb` VARCHAR(45) NULL,
  `youtube` VARCHAR(45) NULL,
  `otheri` VARCHAR(1000) NULL,
  `picpath` VARCHAR(100) NULL,
  PRIMARY KEY (`email`));

select * from iprofile;

create table events(emailid varchar(30),events varchar(30),doe date,tos time,city varchar(20),venue varchar(20));
select * from events;	