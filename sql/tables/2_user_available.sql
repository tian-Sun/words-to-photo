-- auto-generated definition
create table user_available
(
    id                 bigint generated by default as identity
        primary key,
    created_at         timestamp with time zone default now() not null,
    updated_at         timestamp with time zone default now() not null,
    user_id            varchar,
    stripe_customer_id varchar,
    available_times    integer
);

comment on table user_available is '用户可用点数记录表';

comment on column user_available.id is '自增id';

comment on column user_available.created_at is '创建时间';

comment on column user_available.updated_at is '更新时间';

comment on column user_available.user_id is '用户id';

comment on column user_available.stripe_customer_id is 'stripe用户id';

comment on column user_available.available_times is '可用点数';
