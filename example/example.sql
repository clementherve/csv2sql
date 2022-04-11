drop table if exists `example`; 
create table if not exists `example` (
	`A` int, 
	`B` int, 
	`C` int, 
	`D` text
); 
insert into `example` 
	(`A`, `B`, `C`, `D`)
 values 
	(0, 1, 2, 'hey'), 
	(1, 1, 3, 'hoy'), 
	(2, 2, 5, 'h\'ay');
