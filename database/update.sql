--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: equipment_mounting_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.equipment_mounting_enum AS ENUM (
    'Пол',
    'Стена'
);


ALTER TYPE public.equipment_mounting_enum OWNER TO postgres;

--
-- Name: invoice_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invoice_status_enum AS ENUM (
    'InProcessing',
    'Created',
    'Paid',
    'Approved',
    'Expired'
);


ALTER TYPE public.invoice_status_enum OWNER TO postgres;

--
-- Name: rental_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rental_status_enum AS ENUM (
    'InProcessing',
    'Approved',
    'Closed'
);


ALTER TYPE public.rental_status_enum OWNER TO postgres;

--
-- Name: request_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.request_status_enum AS ENUM (
    'InProcessing',
    'Accepted',
    'Completed',
    'Approved'
);


ALTER TYPE public.request_status_enum OWNER TO postgres;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'Client',
    'Brigadier',
    'Admin'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accessory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accessory (
    id integer NOT NULL,
    sku text,
    name text NOT NULL,
    "equipmentId" integer,
    price numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    quantity_in_stock integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone,
    quantity_reserved integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.accessory OWNER TO postgres;

--
-- Name: accessory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accessory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accessory_id_seq OWNER TO postgres;

--
-- Name: accessory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accessory_id_seq OWNED BY public.accessory.id;


--
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    id integer NOT NULL,
    city text NOT NULL,
    street text NOT NULL,
    flat integer,
    "deletedAt" timestamp with time zone,
    lat text,
    lon text,
    house text
);


ALTER TABLE public.address OWNER TO postgres;

--
-- Name: address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.address_id_seq OWNER TO postgres;

--
-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;


--
-- Name: brigadier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brigadier (
    id integer NOT NULL,
    firstname text NOT NULL,
    surname text NOT NULL,
    patronymic text NOT NULL,
    "contactNumber" text NOT NULL,
    "userId" integer NOT NULL,
    "deletedAt" timestamp with time zone,
    "avatarUrl" text
);


ALTER TABLE public.brigadier OWNER TO postgres;

--
-- Name: brigadier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brigadier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.brigadier_id_seq OWNER TO postgres;

--
-- Name: brigadier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brigadier_id_seq OWNED BY public.brigadier.id;


--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id integer NOT NULL,
    firstname text NOT NULL,
    surname text NOT NULL,
    patronymic text NOT NULL,
    "contactNumber" text NOT NULL,
    "userId" integer NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_id_seq OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;


--
-- Name: equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment (
    id integer NOT NULL,
    type text NOT NULL,
    mounting public.equipment_mounting_enum DEFAULT 'Пол'::public.equipment_mounting_enum NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.equipment OWNER TO postgres;

--
-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.equipment_id_seq OWNER TO postgres;

--
-- Name: equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;


--
-- Name: invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice (
    id integer NOT NULL,
    "totalPrice" numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    "customerId" integer,
    status public.invoice_status_enum DEFAULT 'InProcessing'::public.invoice_status_enum NOT NULL,
    "deletedAt" timestamp with time zone,
    url text,
    "scanUrl" text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.invoice OWNER TO postgres;

--
-- Name: invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invoice_id_seq OWNER TO postgres;

--
-- Name: invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoice_id_seq OWNED BY public.invoice.id;


--
-- Name: invoice_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_item (
    id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    price numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    sum numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    "invoiceId" integer NOT NULL,
    "accessoryId" integer NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.invoice_item OWNER TO postgres;

--
-- Name: invoice_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invoice_item_id_seq OWNER TO postgres;

--
-- Name: invoice_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoice_item_id_seq OWNED BY public.invoice_item.id;


--
-- Name: request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request (
    id integer NOT NULL,
    comment text,
    status public.request_status_enum DEFAULT 'InProcessing'::public.request_status_enum NOT NULL,
    "addressId" integer,
    "brigadierId" integer,
    "clientId" integer,
    "stageId" integer NOT NULL,
    "registerDate" timestamp with time zone DEFAULT now() NOT NULL,
    "mountingDate" date,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.request OWNER TO postgres;

--
-- Name: request_equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_equipment (
    id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "equipmentId" integer,
    "requestId" integer,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.request_equipment OWNER TO postgres;

--
-- Name: request_equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_equipment_id_seq OWNER TO postgres;

--
-- Name: request_equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_equipment_id_seq OWNED BY public.request_equipment.id;


--
-- Name: request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_id_seq OWNER TO postgres;

--
-- Name: request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_id_seq OWNED BY public.request.id;


--
-- Name: request_report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_report (
    id integer NOT NULL,
    url text NOT NULL,
    "requestId" integer NOT NULL,
    "brigadierId" integer,
    "deletedAt" timestamp with time zone,
    public_id text
);


ALTER TABLE public.request_report OWNER TO postgres;

--
-- Name: request_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_report_id_seq OWNER TO postgres;

--
-- Name: request_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_report_id_seq OWNED BY public.request_report.id;


--
-- Name: schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule (
    id integer NOT NULL,
    "brigadierId" integer,
    "requestId" integer,
    "modifiedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.schedule OWNER TO postgres;

--
-- Name: schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schedule_id_seq OWNER TO postgres;

--
-- Name: schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_id_seq OWNED BY public.schedule.id;


--
-- Name: stage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stage (
    id integer NOT NULL,
    stage text NOT NULL,
    "mountingPrice" numeric(6,2) DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE public.stage OWNER TO postgres;

--
-- Name: stage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stage_id_seq OWNER TO postgres;

--
-- Name: stage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stage_id_seq OWNED BY public.stage.id;


--
-- Name: tool; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tool (
    id integer NOT NULL,
    name text NOT NULL,
    "stageId" integer NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.tool OWNER TO postgres;

--
-- Name: tool_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tool_id_seq OWNER TO postgres;

--
-- Name: tool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tool_id_seq OWNED BY public.tool.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    login text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "resetPasswordLink" text,
    "activationLink" text,
    "temporaryPassword" text,
    "isActivated" boolean DEFAULT false NOT NULL,
    role public.user_role_enum DEFAULT 'Client'::public.user_role_enum NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: accessory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accessory ALTER COLUMN id SET DEFAULT nextval('public.accessory_id_seq'::regclass);


--
-- Name: address id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);


--
-- Name: brigadier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brigadier ALTER COLUMN id SET DEFAULT nextval('public.brigadier_id_seq'::regclass);


--
-- Name: client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);


--
-- Name: equipment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);


--
-- Name: invoice id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice ALTER COLUMN id SET DEFAULT nextval('public.invoice_id_seq'::regclass);


--
-- Name: invoice_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_item ALTER COLUMN id SET DEFAULT nextval('public.invoice_item_id_seq'::regclass);


--
-- Name: request id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request ALTER COLUMN id SET DEFAULT nextval('public.request_id_seq'::regclass);


--
-- Name: request_equipment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_equipment ALTER COLUMN id SET DEFAULT nextval('public.request_equipment_id_seq'::regclass);


--
-- Name: request_report id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_report ALTER COLUMN id SET DEFAULT nextval('public.request_report_id_seq'::regclass);


--
-- Name: schedule id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule ALTER COLUMN id SET DEFAULT nextval('public.schedule_id_seq'::regclass);


--
-- Name: stage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage ALTER COLUMN id SET DEFAULT nextval('public.stage_id_seq'::regclass);


--
-- Name: tool id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool ALTER COLUMN id SET DEFAULT nextval('public.tool_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: accessory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accessory (id, sku, name, "equipmentId", price, quantity_in_stock, "deletedAt", quantity_reserved) FROM stdin;
13	\N	ergergerg	1	1.00	11	\N	0
7	string	string	1	1.00	34	2023-04-17 13:39:32.675937+00	0
10	\N	sswfwefwef	1	10.00	34	2023-04-17 13:39:33.853612+00	0
11	\N	sswfwefwef	1	1.00	124	2023-04-17 13:39:35.40657+00	0
12	\N	wefwef	1	1.00	453	2023-04-17 13:39:36.393632+00	0
16	wwoi	jijqiwrjiewjifj	2	12.00	0	2023-04-17 21:36:36.233507+00	0
20	string	string	1	2.90	0	\N	0
21	string	string	1	2.90	0	\N	0
22	string	string	1	2.90	0	\N	0
23	string	string	1	2.90	0	\N	0
55	string	string	1	2.90	0	\N	0
56	string	string	1	2.90	0	\N	0
57	string	string	1	2.90	0	\N	0
58	string	string	1	2.90	0	\N	0
59	string	string	1	2.90	0	\N	0
60	string	string	1	2.90	0	\N	0
18	string	string	1	2.90	0	2023-05-16 17:24:53.43711+00	0
17	3424	Пресс-тройник	7	11.00	2	2023-05-16 17:26:07.4524+00	0
19	123123	Шнур	1	2.90	2	\N	0
2	\N	Гайка	3	3.00	708	\N	-107
4	11331	Гайка	4	1.00	451	\N	-16
5		Пресс-муфта	2	2.00	414	\N	-192
1	 	Гайка 33	2	6.00	318	\N	-284
3	\N	Болт	3	1.00	713	\N	-213
15	123123	egerg	3	2.00	34	\N	-12
14	2123123	string	1	1.00	22	\N	74
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address (id, city, street, flat, "deletedAt", lat, lon, house) FROM stdin;
38	Минск	Черниговская	\N	\N	53.8628267	27.5302989	5
40	Минск	Червякова	\N	\N	53.9212048	27.5502992	3
45	Минск	Свердлова	313	\N	53.8921644	27.5584823	13А
2	Минск	Советская	\N	\N	54.001733	27.709487	1
35	Минск	Рижский	22	\N	53.863110	27.528333	4
39	Минск	Грушевская	66	\N	53.876593	27.510509	133
41	Минск	Притыцкого	18	\N	53.909254	27.485124	42
42	Минск	Партизанский проспект	99	\N	53.874041	27.627669	52А
37	Минск	Макаёнка	777	\N	53.922379	27.624129	12К
43	Минск	Белинского	3	\N	53.935061	27.606244	14
1	Минск	Хоружей	33	\N	53.923519	27.554950	42
44	Минск	Михася Лынькова	55	\N	53.925884	27.484477	23Г
46	Минск	Матусевича	9	\N	53.9164737	27.4398149	88
\.


--
-- Data for Name: brigadier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brigadier (id, firstname, surname, patronymic, "contactNumber", "userId", "deletedAt", "avatarUrl") FROM stdin;
1	Егор	Егоров	Егорович	375446352712	3	\N	https://res.cloudinary.com/dblablirp/image/upload/v1681739858/brigadiersAvatars/1.jpg
3	Мирон 	Кузьмин 	Егорович	375446352713	5	\N	https://res.cloudinary.com/dblablirp/image/upload/v1681739298/brigadiersAvatars/3.jpg
5	Евгений	Сурков	Константинович	375445657565	9	\N	https://res.cloudinary.com/dblablirp/image/upload/v1681739487/brigadiersAvatars/5.jpg
4	Александр	Абрамов	Серафимович	375447586976	8	\N	https://res.cloudinary.com/dblablirp/image/upload/v1681739332/brigadiersAvatars/4.jpg
6	brigadier7	brigadier7	brigadier7	375293535363	12	\N	https://res.cloudinary.com/dblablirp/image/upload/v1681766860/brigadiersAvatars/6.png
2	Бригадир	Бригадиров	Бригад	375446352713	4	\N	https://res.cloudinary.com/dblablirp/image/upload/v1682859460/brigadiersAvatars/2.jpg
7	Кирилл	Ермаков	Антонович	375293746584	17	\N	https://res.cloudinary.com/dblablirp/image/upload/v1684180701/brigadiersAvatars/7.png
8	Иван	Яковлев	Валерьянович	375294758697	19	\N	\N
9	Елизавета	Зинович	Игоревна	375445634337	20	\N	\N
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, firstname, surname, patronymic, "contactNumber", "userId", "deletedAt") FROM stdin;
2	Алексей	Алексеев	Алексеевич	375446782833	6	\N
3	Андрей	Андреев	Андреевич	375446788882	7	\N
4	Диана	Карпова	Борисовна	+375445678695	10	\N
1	Анна	Морозова	Тимофеевна	375445634337	2	\N
5	Федора	Анисимов	Иванович	375446575857	11	\N
6	client4	client4	client4	375445634437	13	\N
7	client4	client4	client4	375445634437	14	\N
8	client4	client44	client4	375445634437	15	\N
9	Вероника	Кузнецова	Максимовна	375294657689	16	\N
10	Елизавета	Зинович	Игоревна	375445634338	18	\N
\.


--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipment (id, type, mounting, "deletedAt") FROM stdin;
2	Конвектор внутрипольный	Пол	\N
3	Радиатор настенный	Стена	\N
5	уцацуацуацуауа	Пол	2023-04-16 14:54:58.603915+00
1	Радиатор напольный	Стена	\N
4	Конвектор настенный	Пол	\N
6	цуацуацуацуа	Стена	2023-04-17 13:41:14.578144+00
7	Стол	Стена	2023-05-16 17:26:07.4524+00
8	string	Пол	2023-05-16 17:26:08.319182+00
9	<string>	Стена	2023-05-16 17:26:08.888522+00
\.


--
-- Data for Name: invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice (id, "totalPrice", "customerId", status, "deletedAt", url, "scanUrl", "createdAt", "updatedAt") FROM stdin;
51	2.00	2	Created	2023-05-08 07:56:09.434282+00	\N	\N	2023-05-10 12:56:42.833727+00	2023-05-10 12:56:42.833727+00
54	205.00	2	Created	2023-05-08 07:40:44.564582+00	\N	\N	2023-05-10 12:56:42.833727+00	2023-05-10 12:56:42.833727+00
55	132.00	1	Created	2023-05-08 08:01:56.490759+00	\N	\N	2023-05-10 12:56:42.833727+00	2023-05-10 12:56:42.833727+00
57	20.00	2	Approved	\N	\N	\N	2023-05-10 12:56:42.833727+00	2023-05-10 12:56:42.833727+00
53	6.00	6	Paid	\N	\N	\N	2023-05-10 12:56:42.833727+00	2023-05-10 12:56:42.833727+00
58	72.00	2	Paid	\N	\N	\N	2023-05-10 12:56:42.833727+00	2023-05-10 12:56:42.833727+00
59	3.00	2	InProcessing	2023-05-08 13:38:53.237984+00	\N	\N	2023-05-10 12:56:42.833727+00	2023-05-10 12:56:42.833727+00
60	5.00	2	InProcessing	\N	\N	https://res.cloudinary.com/dblablirp/image/upload/v1683899814/invoiceScans/60.png	2023-05-10 12:56:42.833727+00	2023-05-12 13:57:36.711506+00
61	104.00	7	Created	\N	\N	https://res.cloudinary.com/dblablirp/image/upload/v1684181297/invoiceScans/61.pdf	2023-05-15 20:00:58.815416+00	2023-05-15 20:08:14.99+00
56	8.00	2	Expired	2023-05-19 09:00:00.06797+00	\N	\N	2023-05-10 12:56:42.833727+00	2023-05-19 09:00:00.06797+00
52	1198.00	3	Expired	2023-05-19 09:00:00.06797+00	\N	\N	2023-04-10 12:56:42.833+00	2023-05-19 09:00:00.06797+00
\.


--
-- Data for Name: invoice_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_item (id, quantity, price, sum, "invoiceId", "accessoryId", "deletedAt") FROM stdin;
63	34	6.00	204.00	54	1	2023-05-08 07:40:44.564582+00
52	1	1.00	1.00	51	4	2023-05-08 07:56:09.434282+00
53	1	1.00	1.00	51	3	2023-05-08 07:56:09.434282+00
64	22	6.00	132.00	55	1	2023-05-08 08:01:56.490759+00
67	2	2.00	4.00	57	5	\N
68	4	3.00	12.00	57	2	\N
69	4	1.00	4.00	57	3	\N
70	11	6.00	66.00	58	1	\N
71	2	3.00	6.00	58	2	\N
79	1	6.00	6.00	53	1	\N
61	11	1.00	11.00	53	13	2023-05-08 13:12:06.27231+00
62	123	1.00	123.00	53	14	2023-05-08 13:12:06.27231+00
80	3	1.00	3.00	59	3	2023-05-08 13:38:53.237984+00
81	1	3.00	3.00	60	2	\N
82	2	1.00	2.00	60	3	\N
87	32	2.00	64.00	61	5	\N
88	2	1.00	2.00	61	4	\N
89	10	1.00	10.00	61	3	\N
90	16	1.00	16.00	61	14	\N
91	2	6.00	12.00	61	1	\N
83	32	2.00	64.00	61	5	2023-05-15 20:03:12.675977+00
84	6	1.00	6.00	61	14	2023-05-15 20:03:12.675977+00
85	2	1.00	2.00	61	4	2023-05-15 20:03:12.675977+00
86	10	1.00	10.00	61	3	2023-05-15 20:03:12.675977+00
65	2	1.00	2.00	56	4	2023-05-19 09:00:00.06797+00
66	3	2.00	6.00	56	5	2023-05-19 09:00:00.06797+00
54	111	1.00	111.00	52	14	2023-05-19 09:00:00.06797+00
55	22	2.00	44.00	52	15	2023-05-19 09:00:00.06797+00
56	222	2.00	444.00	52	5	2023-05-19 09:00:00.06797+00
57	332	1.00	332.00	52	4	2023-05-19 09:00:00.06797+00
58	221	1.00	221.00	52	3	2023-05-19 09:00:00.06797+00
59	12	2.00	24.00	52	2	2023-05-19 09:00:00.06797+00
60	22	1.00	22.00	52	1	2023-05-19 09:00:00.06797+00
\.


--
-- Data for Name: request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request (id, comment, status, "addressId", "brigadierId", "clientId", "stageId", "registerDate", "mountingDate", "deletedAt") FROM stdin;
38	Ми	Completed	38	\N	1	3	2023-04-10 16:12:38.575215+00	2023-04-14	\N
35	Код от домофона - 1444	Completed	35	5	2	1	2023-04-10 13:42:10.120677+00	2023-04-14	\N
42	\N	Approved	42	3	1	1	2023-04-10 16:22:45.021688+00	2023-04-12	\N
44	Злая осбака	Accepted	44	2	1	3	2023-04-16 15:00:57.835529+00	2023-04-20	\N
45	3 этаж	Accepted	45	1	3	3	2023-04-17 13:21:09.169174+00	2023-04-19	\N
39	\N	Approved	39	3	1	1	2023-04-10 16:17:25.904217+00	2023-04-19	\N
41	\N	Approved	41	4	1	2	2023-04-10 16:22:26.303009+00	2023-04-12	\N
40	\N	Approved	40	5	1	1	2023-04-10 16:19:56.659743+00	2023-04-19	\N
43	\N	Accepted	43	2	1	1	2023-04-11 16:24:38.641458+00	2023-04-16	\N
1	Частный дом	Approved	1	3	1	2	2023-04-10 13:42:10.120677+00	2023-04-14	\N
2	\N	Approved	2	2	2	2	2023-04-10 13:42:10.120677+00	2023-04-14	\N
37	\N	Approved	37	\N	1	3	2023-04-10 15:54:13.859508+00	2023-04-14	\N
46	До 5 на лифте, потом вниз и налево	Accepted	46	4	5	1	2023-05-17 21:25:46.271+00	2023-04-19	\N
\.


--
-- Data for Name: request_equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_equipment (id, quantity, "equipmentId", "requestId", "deletedAt") FROM stdin;
1	1	2	1	\N
2	2	3	1	\N
3	3	3	2	\N
4	2	4	2	\N
36	1	1	35	\N
37	2	3	35	\N
40	2	1	37	\N
41	2	2	38	\N
42	1	3	38	\N
43	1	3	39	\N
44	1	1	39	\N
45	1	1	40	\N
46	1	3	41	\N
47	1	2	42	\N
48	1	3	42	\N
49	1	2	43	\N
51	2	1	44	\N
52	1	2	44	\N
53	3	3	44	\N
50	2	\N	43	\N
54	1	1	45	\N
55	2	3	45	\N
56	1	2	46	\N
57	2	3	46	\N
\.


--
-- Data for Name: request_report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_report (id, url, "requestId", "brigadierId", "deletedAt", public_id) FROM stdin;
49	https://res.cloudinary.com/dblablirp/image/upload/v1681739742/reports/44/02e1034ec8069239a974416cf7ea5f4a.jpg.jpg	44	2	\N	reports/44/02e1034ec8069239a974416cf7ea5f4a.jpg
50	https://res.cloudinary.com/dblablirp/image/upload/v1681739742/reports/44/33e7241322daea62570e70d0b7545e6e.jpg.jpg	44	2	\N	reports/44/33e7241322daea62570e70d0b7545e6e.jpg
51	https://res.cloudinary.com/dblablirp/image/upload/v1681739783/reports/42/b142d3e38bc76136117c65b8ef539d2f.jpg.jpg	42	3	\N	reports/42/b142d3e38bc76136117c65b8ef539d2f.jpg
52	https://res.cloudinary.com/dblablirp/image/upload/v1681739783/reports/42/chernovaja-otdelka-2.jpg.jpg	42	3	\N	reports/42/chernovaja-otdelka-2.jpg
4	https://res.cloudinary.com/dblablirp/image/upload/v1653247002/qcg8wablza0kh3agnt6i.webp	41	\N	\N	\N
6	https://res.cloudinary.com/dblablirp/image/upload/v1653247002/qcg8wablza0kh3agnt6i.webp	41	\N	\N	\N
7	https://res.cloudinary.com/dblablirp/image/upload/v1653247002/qcg8wablza0kh3agnt6i.webp	41	\N	\N	\N
8	[object Object]	1	\N	\N	\N
42	https://res.cloudinary.com/dblablirp/image/upload/v1681655307/reports/2/Screenshot%202023-03-02%20132029.png.png	2	2	\N	reports/2/Screenshot 2023-03-02 132029.png
53	https://res.cloudinary.com/dblablirp/image/upload/v1681767247/reports/40/%C3%90%C2%91%C3%90%C2%B5%C3%90%C2%B7%20%C3%90%C2%B8%C3%90%C2%BC%C3%90%C2%B5%C3%90%C2%BD%C3%90%C2%B8.jpg.jpg	40	5	\N	reports/40/ÐÐµÐ· Ð¸Ð¼ÐµÐ½Ð¸.jpg
54	https://res.cloudinary.com/dblablirp/image/upload/v1681767248/reports/40/02e1034ec8069239a974416cf7ea5f4a.jpg.jpg	40	5	\N	reports/40/02e1034ec8069239a974416cf7ea5f4a.jpg
\.


--
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule (id, "brigadierId", "requestId", "modifiedDate", "deletedAt") FROM stdin;
2	2	2	2023-04-10 13:43:06.76568+00	2023-04-10 13:45:25.551463+00
37	4	2	2023-04-10 13:43:06.76568+00	2023-04-10 13:45:25.551463+00
38	5	2	2023-04-10 13:45:25.567173+00	2023-04-10 13:56:41.290951+00
39	1	2	2023-04-10 13:56:41.306064+00	2023-04-10 13:57:52.95603+00
40	3	2	2023-04-10 13:57:52.968508+00	2023-04-10 13:58:02.13772+00
42	3	39	2023-04-11 17:10:38.264681+00	\N
44	3	42	2023-04-11 17:10:57.337226+00	\N
45	4	41	2023-04-11 17:11:05.840257+00	\N
46	5	40	2023-04-11 17:11:32.729533+00	\N
35	2	35	2023-04-10 13:43:06.76568+00	2023-04-11 17:11:53.412735+00
48	5	35	2023-04-11 17:11:53.428056+00	\N
1	2	1	2023-04-10 13:43:06.76568+00	2023-04-11 17:12:04.198308+00
3	1	1	2023-04-10 13:43:06.76568+00	2023-04-11 17:12:04.198308+00
49	3	1	2023-04-11 17:12:04.210811+00	\N
41	1	2	2023-04-10 13:58:02.148001+00	2023-04-11 17:12:13.63709+00
50	2	2	2023-04-11 17:12:13.647558+00	\N
43	4	43	2023-04-11 17:10:47.394625+00	2023-04-16 14:52:34.77109+00
51	2	43	2023-04-16 14:52:34.802555+00	\N
52	1	44	2023-04-16 15:02:07.75853+00	2023-04-16 15:41:10.335342+00
53	2	44	2023-04-16 15:41:10.348003+00	\N
54	1	45	2023-04-17 13:22:39.517764+00	\N
55	4	46	2023-04-17 21:30:12.250916+00	2023-04-18 09:27:39.901442+00
56	2	46	2023-04-18 09:27:39.954001+00	2023-04-18 09:28:50.923798+00
57	4	46	2023-04-18 09:28:50.939936+00	\N
\.


--
-- Data for Name: stage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stage (id, stage, "mountingPrice") FROM stdin;
2	Черновая	150.00
3	Обе	200.00
1	Чистовая	70.00
\.


--
-- Data for Name: tool; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool (id, name, "stageId", "deletedAt") FROM stdin;
2	Рулетка	3	\N
4	Молоток	3	\N
5	Линейка	3	\N
7	Штроборез	1	\N
1	Отбойник	1	\N
6	Перфоратор	1	\N
3	string	1	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, login, email, password, "resetPasswordLink", "activationLink", "temporaryPassword", "isActivated", role, "deletedAt") FROM stdin;
1	admin	lizavetazinovich@gmail.com	$2a$04$zjpv/0CdrBrCi0pjiGQkcufvu707pOX71GfMuZUeLBiZVCeVmblqC	\N	\N	\N	t	Admin	\N
2	client1	client1@gmail.com	$2a$04$4EYhWTCZiu.QcM27.6BgBu1wg6dID8QOxN3TGTLTxPZ7jZ4XS4RHa	\N	9230c9a8-abc1-4df6-bf01-b14965ba36d5	\N	t	Client	\N
4	brigadier2	brigadier2@gmail.com	$2a$04$uKTuYJYkoWhp4zIkvfUu.elGlQtTghasUgBmSBInWkBVBMAhtmqWq	\N	b0fda5aa-81ef-4aed-ace6-21c77687491d	\N	t	Brigadier	\N
7	client3	client3@gmail.com	$2a$04$KcTVhzOY.FQ/Y03UuO9/JelvD6Z1OAsPiN3.8xSYoFzRhRPiZ3bGu	\N	28cfa972-a439-4954-9976-1dc2cf2d5b80	\N	t	Client	\N
5	brigadier3	brigadier3@gmail.com	$2a$04$CYK7AwYeQ4Qw8kg7w0XB1O6zewP9CUIg/14IHOQUkucWetjk0KRim	\N	b3dde61f-c77a-4dec-b29d-12d0dca4a810	\N	t	Brigadier	\N
10	string	string@mail.ru	$2a$04$V2WEH6jUQRAFe79..uf1auTFMLWe9O1y5xRPrtNUHaEpiTl4yZpZS	\N	f998dbef-397b-4716-82b5-ffba7b457be0	\N	t	Client	\N
9	brigadier6	brigadier6@gmail.com	$2a$04$KEwBy7quVqKb.IMSnw7ozOiBlUWyINOR17zzytInlgQYRSCQrnoqm	\N	542dc62b-c7ad-4d4f-abe4-b1f33a64f390	\N	t	Brigadier	\N
3	brigadier1	brigadier1@gmail.com	$2a$04$MsfT7yy8ZK51yRe94BcQ0uuhSQgwr1f617fqY/PguWy7jR1oaJaMK	\N	f8fded90-65dd-46d2-90e8-a48538ca8504	\N	t	Brigadier	\N
11	client6	client6@gmail.com	$2a$04$E/Q9DEw2Qan.dVa/U/v/I.ck4/dRI1zJrrwE.V5w.m471G8rVOnEu	\N	d72f5c36-a422-4b40-9902-75be09db97c4	\N	t	Client	\N
12	brigadier7	brigadier7@gmail.com	$2a$04$CVHMRQ5fM1i0GxDqq0s5xuj1mZZfUGrdUqze9uW5qy3ZwKidsIGIi	\N	0db44e1b-2d70-48a0-830a-676723589e67	\N	t	Brigadier	\N
6	client2	client2@gmail.com	$2a$04$yCPypCsf0WnPGWMfvzuSa.ZLSaDVF1D8vFKO4OR6S0FYprKWvx0du	\N	b098fef5-c574-4215-837c-429653428d6b	\N	t	Client	\N
13	client4	lizavetazinovich1@gmail.com	$2a$04$l5SWllaPZ917/PT017slfe5VJQ9V79l.xFEfyUW7Se15Itv1pKiTG	\N	ac0532a5-93b6-45a7-8807-c65064a14a5e	\N	t	Client	\N
14	client42	lizavetazinovich11@gmail.com	$2a$04$zarRvynekDuk70g9CKiPDuBE6nDGYJUTcjoTQb8j4./.2FiCYIVdS	\N	7515ed1d-0500-482a-945d-06f8f8b4153b	\N	t	Client	\N
15	client424	lizavetazinovich112@gmail.com	$2a$04$8fwZ0..NgGNZ6fBSO4A1fOhDnBJDLQLK3IkoPzXOOi7utD4OdEgX.	\N	4493b57b-cbc1-4972-aabc-35ffffe32b51	\N	t	Client	\N
16	kuznetsova	client66@gmail.com	$2a$04$uYWKQIa.X49iH2w1mnWcd.QAj2I9JVy.kb4m6IwqdZMkZhTtkFKG6	\N	932f2476-2dc4-4038-a703-f625bdea0b19	\N	t	Client	\N
17	ermakov	brigadier66@gmail.com	$2a$04$wBmQZaQGu7HmGqBx0462yukabN4lNVRvoIn1VIcPzjfYBg4bPWcyO	\N	b71412f9-6935-49c3-a7fa-0b2be6ff4b9f	\N	t	Brigadier	\N
8	brigadier4	brigadier4@gmail.com	$2a$04$UVHjMcJryTwAkrlq3yoSDODruNdM4X2GYo/GRIcxxMYSWWWnNeSZq	\N	cc9928a0-2fa9-490f-bb6b-bdb782f77544	\N	t	Brigadier	\N
18	zinovich	admin@gmail.com	$2a$04$1AvTBh5LRRh9L45K7nJCZu1WBgCiyPArCsrYOLx8WfoegSJZ.cIJK	\N	ccc69c7f-6b3e-4ecb-90ed-07ddfc0ac3b3	\N	t	Client	\N
19	lizavetagmail	lizaveta@gmail.com	$2a$04$ZUTttKWUcT9BTi2gk5IYnOMXMAQNFSYW6ElzMlWCMILZBuPCkq3de	\N	e6485cfe-1ae1-4164-bac1-b4b447d9a79f	\N	f	Brigadier	\N
20	brigadier11	brigadier11@gmail.com	$2a$04$8ZOVy5HmPHHMo3WUPsP8Zububiit3Sw2NqxXvA3aUrvMhVEmX2oLO	\N	5f2c61c1-85df-43f3-acdf-22ec5af301d1	\N	f	Brigadier	\N
\.


--
-- Name: accessory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accessory_id_seq', 60, true);


--
-- Name: address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_id_seq', 46, true);


--
-- Name: brigadier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brigadier_id_seq', 9, true);


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 10, true);


--
-- Name: equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipment_id_seq', 9, true);


--
-- Name: invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_id_seq', 61, true);


--
-- Name: invoice_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_item_id_seq', 91, true);


--
-- Name: request_equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_equipment_id_seq', 57, true);


--
-- Name: request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_id_seq', 46, true);


--
-- Name: request_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_report_id_seq', 54, true);


--
-- Name: schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_id_seq', 57, true);


--
-- Name: stage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stage_id_seq', 3, true);


--
-- Name: tool_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tool_id_seq', 10, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 20, true);


--
-- Name: equipment PK_0722e1b9d6eb19f5874c1678740; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY (id);


--
-- Name: request_report PK_0c224d3c050ff241390da56f127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_report
    ADD CONSTRAINT "PK_0c224d3c050ff241390da56f127" PRIMARY KEY (id);


--
-- Name: invoice PK_15d25c200d9bcd8a33f698daf18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY (id);


--
-- Name: request PK_167d324701e6867f189aed52e18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY (id);


--
-- Name: schedule PK_1c05e42aec7371641193e180046; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY (id);


--
-- Name: tool PK_3bf5b1016a384916073184f99b7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool
    ADD CONSTRAINT "PK_3bf5b1016a384916073184f99b7" PRIMARY KEY (id);


--
-- Name: invoice_item PK_621317346abdf61295516f3cb76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_item
    ADD CONSTRAINT "PK_621317346abdf61295516f3cb76" PRIMARY KEY (id);


--
-- Name: client PK_96da49381769303a6515a8785c7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY (id);


--
-- Name: stage PK_c54d11b3c24a188262844af1612; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage
    ADD CONSTRAINT "PK_c54d11b3c24a188262844af1612" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: address PK_d92de1f82754668b5f5f5dd4fd5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY (id);


--
-- Name: accessory PK_e1ead99f958789eeebd86246d74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accessory
    ADD CONSTRAINT "PK_e1ead99f958789eeebd86246d74" PRIMARY KEY (id);


--
-- Name: request_equipment PK_f4a3936de545920cfe2138617be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_equipment
    ADD CONSTRAINT "PK_f4a3936de545920cfe2138617be" PRIMARY KEY (id);


--
-- Name: brigadier PK_fddf0c0ff18caff7fd4c294be51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brigadier
    ADD CONSTRAINT "PK_fddf0c0ff18caff7fd4c294be51" PRIMARY KEY (id);


--
-- Name: request REL_3782dc6d12e6e474d8bab1d080; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "REL_3782dc6d12e6e474d8bab1d080" UNIQUE ("addressId");


--
-- Name: client REL_ad3b4bf8dd18a1d467c5c0fc13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "REL_ad3b4bf8dd18a1d467c5c0fc13" UNIQUE ("userId");


--
-- Name: user UQ_a62473490b3e4578fd683235c5e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE (login);


--
-- Name: brigadier UQ_c4e9124b1ee7a27d9fd2c3d8d70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brigadier
    ADD CONSTRAINT "UQ_c4e9124b1ee7a27d9fd2c3d8d70" UNIQUE ("userId");


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: Equipment_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Equipment_pkey" ON public.equipment USING btree (id);


--
-- Name: accessory_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX accessory_pkey ON public.accessory USING btree (id);


--
-- Name: address_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX address_pkey ON public.address USING btree (id);


--
-- Name: brigadier_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brigadier_pkey ON public.brigadier USING btree (id);


--
-- Name: client_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX client_pkey ON public.client USING btree (id);


--
-- Name: invoice_item_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoice_item_pkey ON public.invoice_item USING btree (id);


--
-- Name: invoice_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoice_pkey ON public.invoice USING btree (id);


--
-- Name: request_equipment_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX request_equipment_pkey ON public.request_equipment USING btree (id);


--
-- Name: request_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX request_pkey ON public.request USING btree (id);


--
-- Name: request_report_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX request_report_pkey ON public.request_report USING btree (id);


--
-- Name: schedule_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX schedule_pkey ON public.schedule USING btree (id);


--
-- Name: stage_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX stage_pkey ON public.stage USING btree (id);


--
-- Name: tool_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tool_pkey ON public.tool USING btree (id);


--
-- Name: user_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_pkey ON public."user" USING btree (id);


--
-- Name: request FK_093c2cacb1cede069dab9e65fde; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_093c2cacb1cede069dab9e65fde" FOREIGN KEY ("stageId") REFERENCES public.stage(id);


--
-- Name: request FK_3782dc6d12e6e474d8bab1d080b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_3782dc6d12e6e474d8bab1d080b" FOREIGN KEY ("addressId") REFERENCES public.address(id) ON DELETE CASCADE;


--
-- Name: invoice_item FK_553d5aac210d22fdca5c8d48ead; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_item
    ADD CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead" FOREIGN KEY ("invoiceId") REFERENCES public.invoice(id);


--
-- Name: invoice_item FK_665e1dd6d822f2cfcff5143cd02; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_item
    ADD CONSTRAINT "FK_665e1dd6d822f2cfcff5143cd02" FOREIGN KEY ("accessoryId") REFERENCES public.accessory(id);


--
-- Name: request_report FK_83083584fa7b09fdd819fa0771d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_report
    ADD CONSTRAINT "FK_83083584fa7b09fdd819fa0771d" FOREIGN KEY ("requestId") REFERENCES public.request(id);


--
-- Name: request_report FK_8e5c322972abbb979259f37b376; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_report
    ADD CONSTRAINT "FK_8e5c322972abbb979259f37b376" FOREIGN KEY ("brigadierId") REFERENCES public.brigadier(id);


--
-- Name: invoice FK_925aa26ea12c28a6adb614445ee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "FK_925aa26ea12c28a6adb614445ee" FOREIGN KEY ("customerId") REFERENCES public.brigadier(id);


--
-- Name: client FK_ad3b4bf8dd18a1d467c5c0fc13a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "FK_ad3b4bf8dd18a1d467c5c0fc13a" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: request_equipment FK_c2e6f5443cd62a4db7ee5515eb8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_equipment
    ADD CONSTRAINT "FK_c2e6f5443cd62a4db7ee5515eb8" FOREIGN KEY ("equipmentId") REFERENCES public.equipment(id);


--
-- Name: schedule FK_c42cd2920265cb7a385f2e99e4c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "FK_c42cd2920265cb7a385f2e99e4c" FOREIGN KEY ("requestId") REFERENCES public.request(id);


--
-- Name: brigadier FK_c4e9124b1ee7a27d9fd2c3d8d70; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brigadier
    ADD CONSTRAINT "FK_c4e9124b1ee7a27d9fd2c3d8d70" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: request_equipment FK_c91a8f29b64d2106ff429041e43; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_equipment
    ADD CONSTRAINT "FK_c91a8f29b64d2106ff429041e43" FOREIGN KEY ("requestId") REFERENCES public.request(id);


--
-- Name: schedule FK_cdeba1cf912253419bb09448e01; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "FK_cdeba1cf912253419bb09448e01" FOREIGN KEY ("brigadierId") REFERENCES public.brigadier(id);


--
-- Name: accessory FK_d1fe25c8452a77e3513437d4e7b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accessory
    ADD CONSTRAINT "FK_d1fe25c8452a77e3513437d4e7b" FOREIGN KEY ("equipmentId") REFERENCES public.equipment(id);


--
-- Name: request FK_df30188ff79f9f7637e159a739f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_df30188ff79f9f7637e159a739f" FOREIGN KEY ("clientId") REFERENCES public.client(id);


--
-- Name: tool FK_e11e3f20a86dc84bd996bbd9f57; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool
    ADD CONSTRAINT "FK_e11e3f20a86dc84bd996bbd9f57" FOREIGN KEY ("stageId") REFERENCES public.stage(id);


--
-- Name: request FK_ffe66307105b8f490ed5d0ddad5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_ffe66307105b8f490ed5d0ddad5" FOREIGN KEY ("brigadierId") REFERENCES public.brigadier(id);


--
-- PostgreSQL database dump complete
--

