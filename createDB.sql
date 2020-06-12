create schema if not exists kompass default character set utf8;

drop table if exists kompass.companies;

create table if not exists kompass.companies
(
    id               int auto_increment
        primary key,
    title            varchar(100) null,
    address          varchar(100) null,
    fax              varchar(50)  null,
    status           varchar(50)  null,
    year             varchar(10)  null,
    form             varchar(10)  null,
    activity         varchar(50)  null,
    officeEmployees  varchar(10)  null,
    companyEmployees varchar(10)  null,
    kompassID        varchar(20)  null
);

