drop table if exists `example`; 
create table if not exists `example` (
	`A` int unique, 
	`B` int not null, 
	`C` int unique not null, 
	`D` text not null
); 
insert into `example` 
	(`A`, `B`, `C`, `D`)
 values 
	(0, 1, 2, 'hoy'), 
	(null, 1, 3, 'hoy'), 
	(2, 2, 5, 'h\'ay');
