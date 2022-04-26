drop table if exists `example`; 
create table if not exists `example` (
	`field1` undefined unique, 
	`field2` undefined not null, 
	`field3` undefined unique not null, 
	`field4` text not null
); 
insert into `example` 
	(`field1`, `field2`, `field3`, `field4`)
 values 
	('A', 'B', 'C', 'D'), 
	('0', '1', '2', 'hoy'), 
	('null', '1', '3', 'hoy'), 
	('2', '2', '5', 'h\'ay');
