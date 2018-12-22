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
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.

// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;
// const mailTransport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: gmailEmail,
//     pass: gmailPassword,
//   },
// });

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

        let pacienteFinal = {...pacienteLoop}
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
    console.log(allPacientes)
    comprobarFecha(allPacientes)

    res.send(allPacientes)
    return snapshot
  }).catch(error => {
    console.log(error)
  })

  // res.send(sendWelcomeEmail(email, displayName));
});

function comprobarFecha (allPacientes) {
  let currentDate = new Date()
  allPacientes.forEach(paciente => {
    var auxFecha = new Date(paciente.dia + 'UTC-6')
    if(currentDate.getYear() === auxFecha.getYear()){
      if(currentDate.getMonth() === auxFecha.getMonth()){
        if(currentDate.getDate() === (auxFecha.getDate() - 1)){
          sendEmail(paciente)
        }
      }
    }
  })
}

// Sends a welcome email to the given user.
function sendEmail(paciente) {

  var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto','Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  var auxFecha = new Date(paciente.dia + 'UTC-6')
  // The user subscribed to the newsletter.
  mailOptions.subject = paciente.nombre + `, su cita es mañana!`;
  mailOptions.text = `Hola paciente.nombre, Le recordamos su cita es proximo ` + auxFecha.getDate() + ' de ' + meses[auxFecha.getMonth()];

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Se envio un email de confimacion a:', email);
  }).catch(error => {
     return console.log(error);
  });
}
