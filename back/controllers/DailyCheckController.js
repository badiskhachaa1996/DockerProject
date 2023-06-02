const express = require('express');
const app = express();
app.disable("x-powered-by");
const { DailyCheck } = require('./../models/DailyCheck');

// recuperation de la liste des présences de tous les utilisateurs