--task 1
insert into
  course_340.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
values
  (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );


--task 2
update course_340.account a
set
  account_type = 'Admin'
where
  a.account_firstname = 'Tony'
  and a.account_lastname = 'Stark'
  and a.account_email = 'tony@starkent.com';


--task 3
delete from course_340.account a
where
  a.account_firstname = 'Tony'
  and a.account_lastname = 'Stark'
  and a.account_email = 'tony@starkent.com';


--task 4
update course_340.inventory as i
set
  inv_description = replace(
    inv_description,
    'the small interiors',
    'a huge interior'
  )
where
  i.inv_model = 'Hummer'
  and i.inv_make = 'GM';


--task 5
select
  i.inv_model as model,
  i.inv_make as make,
  c.classification_name as classification
from
  course_340.inventory as i
  join course_340.classification as c on i.classification_id = c.classification_id
where
  c.classification_name = 'Sport';


--task 6
update course_340.inventory
set
  inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');