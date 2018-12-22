/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const moment = require('moment')
const fs = require('fs')
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
//firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"
//https://github.com/firebase/functions-samples/tree/master/quickstarts/email-users

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Nawal Services';
admin.initializeApp(functions.config().firebase)

exports.proximasCitas = functions.https.onRequest((req, res) => {
  var allPacientes = [];

  admin.database().ref('/citas').once('value')
  .then(snapshot => {
    // Se crea un foreach del snapshot base y dentro, cada elemento se mete al array
    snapshot.forEach(citas => {
      //Para numerar las ID's de los pacientes
      let contador = 0;
      citas.val().pacientes.forEach(paciente => {
        const pacienteLoop = {
          idCita: citas.key,
          idPaciente: contador++,
          nombre: paciente.name,
          correo: paciente.email
        }

        let pacienteFinal = {
          idCita: pacienteLoop.idCita,
          idPaciente: pacienteLoop.idPaciente,
          nombre: pacienteLoop.nombre,
          correo: pacienteLoop.correo
        }
        // Si son citas separadas, cada usuario tiene una hora y tiempo distinto sino solo tienen una hora
        if(citas.val().citasSeparadas){
          pacienteFinal.citasSeparadas = true
          pacienteFinal.dia = paciente.dataPicker
          pacienteFinal.hora = paciente.timePicker
        }else{
          pacienteFinal.citasSeparadas = false
          pacienteFinal.dia = citas.val().dia
          pacienteFinal.hora = citas.val().hora
        }
        allPacientes.push(pacienteFinal)
      })
    });
    comprobarFecha(allPacientes)
    
    res.send(200)
    return snapshot
  }).catch(error => {
    console.log(error)
  })

  // res.send(sendWelcomeEmail(email, displayName));
});

exports.confirmgDate = functions.https.onRequest((req, res) => {
  const idDate = req.query.date
  const idPersona = req.query.pers
  admin.database().ref('/citas').child(idDate).once('value')
  .then(response => {
    const cita = response.val()
    console.log(cita)
    if(cita.citasSeparadas){
      cita.pacientes[idPersona].status = 'Confirmado'
      let contConfirmados = 0

      cita.pacientes.forEach(paciente => {
        if(paciente.status === 'Confirmado'){
          contConfirmados++
        }
      });

      if (contConfirmados >= cita.pacientes.length) {
        cita.status = 'Confirmado'
      }else if (contConfirmados < cita.pacientes.length && contConfirmados > 0) {
        cita.status = 'Proceso'
      }
    }else{
      cita.status = 'Confirmado'
    }
    admin.database().ref('/citas').child(idDate).remove().then(response => {
      admin.database().ref('/citas').child(idDate).set(cita)
      .then(response => {
        res.send("Se ha confirmado la cita, gracias por su preferencia")
        return response
      }).catch(error => {
        res.send("Error al confirmar su cita!")
        console.log(error)
      })
      return res
    }).catch(error => {
      res.send("Error al confirmar su cita!")
    })
    
    return response
  }).catch(error => {
    res.send("Error al confirmar su cita!")
  })
})

function confirmationLinkGen (paciente) {
  return "https://us-central1-nawal01-dad69.cloudfunctions.net/confirmgDate?date=" +  paciente.idCita +
  "&pers=" + paciente.idPaciente;
}

function comprobarFecha (allPacientes) {
  let currentDate = new Date()
  console.log('Hora del servidor: ' + moment().format("DD/MM/YYYY HH:mm:ss"))
  console.log("--------------------------------------------------------------")

  allPacientes.forEach(paciente => {
    console.log('Hora del paciente: ' + moment(paciente.dia).format("DD/MM/YYYY HH:mm:ss"))

    var auxFecha = new Date(paciente.dia + 'UTC-6')
    if(currentDate.getYear() === auxFecha.getYear()){
      if(currentDate.getMonth() === auxFecha.getMonth()){
        if(currentDate.getDate() === auxFecha.getDate()){
          console.log('La cita del paciente ' + paciente.nombre + ' es el dia de mañana')
          sendEmail(paciente)
        }
      }
    }
  })
  console.log("--------------------------------------------------------------")
}

// Sends a welcome email to the given user.
function sendEmail(paciente) {

  var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto','Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: paciente.correo,
  };

  var auxFecha = new Date(paciente.dia + 'UTC-6')
  // The user subscribed to the newsletter.
  mailOptions.subject = paciente.nombre + `, su cita es mañana!`;
  mailOptions.text = 'Hola ' + paciente.nombre + ', Le recordamos su cita es proximo ' + auxFecha.getDate() + ' de ' + meses[auxFecha.getMonth()] + 
  '. Favor de hacer click en el siguiente enlace para confirmar su cita: \n' + confirmationLinkGen (paciente);

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Se envio un email de confimacion a:', paciente.correo);
  }).catch(error => {
     return console.log(error);
  });
}
