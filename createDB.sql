create schema if not exists kompass default character set utf8;

drop table if exists kompass.companies;

create table if not exists kompass.companies
(
    id               int auto_increment
        primary key,
    title            varchar(200) null,
    address          varchar(400) null,
    fax              varchar(100) null,
    companystatus    varchar(100) null,
    companyyear      varchar(20)  null,
    form             varchar(150) null,
    activity         varchar(200) null,
    officeEmployees  varchar(70)  null,
    companyEmployees varchar(70)  null,
    kompassID        varchar(80)  null
);

