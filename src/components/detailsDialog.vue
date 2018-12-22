<template>
    <v-flex xs6>
        <v-dialog
        v-model="dialog" scrollable max-width="600px" persistent>
            <v-btn color="info" slot="activator">Detalles</v-btn>
            <v-card>
                <v-layout row wrap align-center justify-space-between="">
                    <v-flex xs10 sm6>
                        <v-card-title primary-title class="headline">
                            Detalles de la cita
                        </v-card-title>
                    </v-flex>
                    
                    <v-flex xs4 hidden-xs-only>
                        <delete-cita-dialog :selectedCita="selectedDate" :small="false"></delete-cita-dialog>
                    </v-flex>

                    <v-flex xs2 hidden-sm-and-up>
                        <delete-cita-dialog :selectedCita="selectedDate" :small="true"></delete-cita-dialog>
                    </v-flex>

                </v-layout>
                <v-divider></v-divider>
                <v-card-text style="height: 300px;">
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex xs12 v-for="paciente in selectedDate.pacientes" :key="paciente.id">
                                    <div class="body-1 grey--text mt-2">Paciente #{{paciente.id+1}}</div>
                                    <div class="body-1 ml-3">- {{paciente.name}}</div>
                                    <div class="body-1 ml-3">- {{paciente.therapy}}</div>
                                    <div class="body-1 ml-3">- {{paciente.phone}}</div>
                                    <div class="body-1 ml-3">- {{paciente.email}}</div>
                                    <div v-if="selectedDate.citasSeparadas">
                                        <div class="body-1 grey--text mt-2">Fecha</div>
                                        <div class="body-1 ml-3">- {{paciente.fullDate}}</div>
                                        <div class="body-1 grey--text mt-2">Status individual</div>
                                        <div class="body-1 ml-3">- {{paciente.status}}</div>
                                        <v-divider></v-divider>
                                    </div>
                                </v-flex>
                                <v-flex xs12 v-if="!selectedDate.citasSeparadas">
                                    <div class="body-1 grey--text mt-2">Fecha</div>
                                    <div class="body-1 ml-3">- {{selectedDate.fullDate}}</div>
                                </v-flex>
                                <v-flex xs12>
                                    <div class="body-1 grey--text mt-2">Informacion Extra</div>
                                    <div class="body-1 ml-3">- {{selectedDate.extra}}</div>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>

                            <div class="body-1 grey--text mt-2">Status</div>
                            <div class="body-1 ml-3">{{selectedDate.status}} <v-icon small :color="selectedDate.statusColor">{{selectedDate.statusIcon}}</v-icon></div>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-layout row wrap justify-space-between>
                        <v-flex xs5>
                            <v-btn color="blue darken-1" flat @click="dialog = false">Cerrar</v-btn>
                        </v-flex>
                        <edit-cita-dialog :editableDate="selectedDate"></edit-cita-dialog>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        props: ['selectedDate'],
        data () {
            return {
                dialog: false,
                dialogm1: '',
            }
        },
        methods: {
            onDelete () {

            }
        },
        created () {
        }
    }

    /*
    <div class="body-1 grey--text mt-2">Paciente #2</div>
                            <div class="body-1 ml-3">- Takanshi Rikka</div>
                            <div class="body-1 ml-3">- Terapia 2</div>
                            <div class="body-1 ml-3">- 3317354536</div>
                            <div class="body-1 ml-3">- wrickedeye@gmail.com</div>

                            <div class="body-1 grey--text mt-2">Paciente #2</div>
                            <div class="body-1 ml-3">- Takanshi Rikka</div>
                            <div class="body-1 ml-3">- Terapia 2</div>
                            <div class="body-1 ml-3">- 3317354536</div>
                            <div class="body-1 ml-3">- wrickedeye@gmail.com</div>

                            <div class="body-1 grey--text mt-2">Paciente #2</div>
                            <div class="body-1 ml-3">- Takanshi Rikka</div>
                            <div class="body-1 ml-3">- Terapia 2</div>
                            <div class="body-1 ml-3">- 3317354536</div>
                            <div class="body-1 ml-3">- wrickedeye@gmail.com</div>
                            
                            <div class="body-1 grey--text mt-2">Fecha</div>
                            <div class="body-1 ml-3">- 30 de Febrero del 666</div>*/
</script>