-- --------------------------------
-- Create course_340 schema with types and tables
-- --------------------------------
-- Create schema
create schema "course_340" authorization ua5ww1sokbknedjfrcfc;


-- Create type "account_type"
create type "course_340".account_type as enum('Client', 'Employee', 'Admin');


-- grand myself owner access to the type "account_type"
alter type "course_340".account_type owner to ua5ww1sokbknedjfrcfc;


-- Create table "classification"
create table if not exists
  course_340.classification (
    classification_id int generated by default as identity,
    classification_name varchar not null,
    constraint classification_pk primary key (classification_id)
  );


-- Create table "inventory"
create table if not exists
  "course_340".inventory (
    inv_id int not null generated by default as identity,
    inv_make varchar not null,
    inv_model varchar not null,
    inv_year char(4) not null,
    inv_description text not null,
    inv_image varchar not null,
    inv_thumbnail varchar not null,
    inv_price decimal(9, 0) not null,
    inv_miles int not null,
    inv_color varchar not null,
    classification_id int not null,
    constraint inventory_pk primary key (inv_id),
    constraint fk_classification foreign key (classification_id) references "course_340".classification match simple on update cascade on delete no action
  );


-- Create table "account"
create table if not exists
  "course_340".account (
    account_id int not null generated by default as identity,
    account_firstname varchar not null,
    account_lastname varchar not null,
    account_email varchar not null,
    account_password varchar not null,
    account_type course_340.account_type not null default 'Client'::course_340.account_type,
    constraint account_pk primary key (account_id)
  );


-- --------------------------------
-- Instantiate data for classifications and inventory
-- --------------------------------
-- Insert data into "classification"
insert into
  "course_340".classification (classification_name)
values
  ('Custom'),
  ('Sport'),
  ('SUV'),
  ('Truck'),
  ('Sedan');


-- Insert data into "inventory"
insert into
  "course_340".inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
values
  (
    'Chevy',
    'Camaro',
    '2018',
    'If you want to look cool this is the ar you need! This car has great performance at an affordable price. Own it today!',
    '/images/camaro.jpg',
    '/images/camaro-tn.jpg',
    25000,
    101222,
    'Silver',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Sport'
    )
  ),
  (
    'Batmobile',
    'Custom',
    '2007',
    'Ever want to be a super hero? now you can with the batmobile. This car allows you to switch to bike mode allowing you to easily maneuver through trafic during rush hour.',
    '/images/batmobile.jpg',
    '/images/batmobile-tn.jpg',
    65000,
    29887,
    'Black',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Custom'
    )
  ),
  (
    'FBI',
    'Surveillance Van',
    '2016',
    'do you like police shows? You will feel right at home driving this van, come complete with surveillance equipment for and extra fee of $2,000 a month. ',
    '/images/survan.jpg',
    '/images/survan-tn.jpg',
    20000,
    19851,
    'Brown',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Custom'
    )
  ),
  (
    'Dog ',
    'Car',
    '1997',
    'Do you like dogs? Well this car is for you straight from the 90s from Aspen, Colorado we have the orginal Dog Car complete with fluffy ears.',
    '/images/dog-car.jpg',
    '/images/dog-car-tn.jpg',
    35000,
    71632,
    'Brown',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Custom'
    )
  ),
  (
    'Jeep',
    'Wrangler',
    '2019',
    'The Jeep Wrangler is small and compact with enough power to get you where you want to go. Its great for everyday driving as well as offroading weather that be on the the rocks or in the mud!',
    '/images/wrangler.jpg',
    '/images/wrangler-tn.jpg',
    28045,
    41205,
    'Yellow',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'SUV'
    )
  ),
  (
    'Lamborghini',
    'Adventador',
    '2016',
    'This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws. ',
    '/images/adventador.jpg',
    '/images/adventador-tn.jpg',
    417650,
    71003,
    'Blue',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Sport'
    )
  ),
  (
    'Aerocar International',
    'Aerocar',
    '1963',
    'Are you sick of rushhour trafic? This car converts into an airplane to get you where you are going fast. Only 6 of these were made, get them while they last!',
    '/images/aerocar.jpg',
    '/images/aerocar-tn.jpg',
    700000,
    18956,
    'Red',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Custom'
    )
  ),
  (
    'Monster',
    'Truck',
    '1995',
    'Most trucks are for working, this one is for fun. this beast comes with 60in tires giving you tracktions needed to jump and roll in the mud.',
    '/images/monster-truck.jpg',
    '/images/monster-truck-tn.jpg',
    150000,
    3998,
    'Blue',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Custom'
    )
  ),
  (
    'Cadillac',
    'Escalade',
    '2019',
    'This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.',
    '/images/escalade.jpg',
    '/images/escalade-tn.jpg',
    75195,
    41958,
    'Black',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Truck'
    )
  ),
  (
    'GM',
    'Hummer',
    '2016',
    'Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.',
    '/images/hummer.jpg',
    '/images/hummer-tn.jpg',
    58800,
    56564,
    'Yellow',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Truck'
    )
  ),
  (
    'Mechanic',
    'Special',
    '1964',
    'Not sure where this car came from. However, with a little tender loving care, it will run as good a new.',
    '/images/mechanic.jpg',
    '/images/mechanic-tn.jpg',
    100,
    200125,
    'Rust',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Sedan'
    )
  ),
  (
    'Ford',
    'Model T',
    '1921',
    'The Ford Model T can be a bit tricky to drive. It was the first car to be put into production. You can get it in any color you want as long as it is black.',
    '/images/model-t.jpg',
    '/images/model-t-tn.jpg',
    30000,
    26357,
    'Black',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Sedan'
    )
  ),
  (
    'Mystery',
    'Machine',
    '1999',
    'Scooby and the gang always found luck in solving their mysteries because of there 4 wheel drive Mystery Machine. This Van will help you do whatever job you are required to with a success rate of 100%.',
    '/images/mystery-van.jpg',
    '/images/mystery-van-tn.jpg',
    10000,
    128564,
    'Green',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Custom'
    )
  ),
  (
    'Spartan',
    'Fire Truck',
    '2012',
    'Emergencies happen often. Be prepared with this Spartan fire truck. Comes complete with 1000 ft. of hose and a 1000 gallon tank.',
    '/images/fire-truck.jpg',
    '/images/fire-truck-tn.jpg',
    50000,
    38522,
    'Red',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Truck'
    )
  ),
  (
    'Ford',
    'Crown Victoria',
    '2013',
    'After the police force updated their fleet these cars are now available to the public! These cars come equiped with the siren which is convenient for college students running late to class.',
    '/images/crwn-vic.jpg',
    '/images/crwn-vic-tn.jpg',
    10000,
    108247,
    'White',
    (
      select
        classification_id
      from
        course_340.classification
      where
        classification_name = 'Sedan'
    )
  );


-- --------------------------------
-- fix typo in hummer record
-- --------------------------------
update course_340.inventory as i
set
  inv_description = replace(
    inv_description,
    'the small interiors',
    'a huge interior'
  )
where
  i.inv_id = (
    select
      inv_id
    from
      course_340.inventory i
    where
      i.inv_model = 'Hummer'
      and i.inv_make = 'GM'
  );


-- --------------------------------
-- update image paths
-- --------------------------------
update course_340.inventory
set
  inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');