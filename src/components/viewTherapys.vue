<template>
    <v-container grid-list-xs>
        <v-layout row wrap justify-center>
            <v-flex xs12>
                <v-layout row wrap>
                    <v-flex xs12 sm6 md4 v-for="aux in getLoadedDates" :key="aux.id">
                        <!-- progress card -->
                        <v-card :color="aux.statusColor" class="mb-2">
                            <v-card-title primary-title>
                                <v-flex xs12>
                                    <v-layout row >
                                        <span>{{aux.fullDate}}</span>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12 mt-2>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <span class="white--text">Paciente(s): </span>
                                        </v-flex>
                                        <v-flex xs12 v-for="aux1 in aux.pacientes" :key="aux1.name">
                                            <span>- {{aux1.name}}</span>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-layout row wrap align-center>
                                    <details-dialog :selectedDate="aux"></details-dialog>
                                    <v-flex xs6 text-xs-center mt-1>
                                        Status: {{aux.status}}
                                        <v-icon small>{{aux.statusIcon}}</v-icon>
                                    </v-flex>
                                </v-layout>
                            </v-card-title>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data () {
            return {
            }
        },
        computed: {
            getLoadedDates () {
                const dates = this.$store.getters.getLoadedDates
                const months = this.$store.getters.getMonths
                dates.forEach(element => {
                    let cont = 0
                    if(element != null && element != undefined){
                        // Cargando fechas
                        let fullDate = new Date(element.dia + 'UTC-6')
                        let dia = fullDate.getDate()
                        let mes = fullDate.getMonth()
                        let año = fullDate.getUTCFullYear()
                        // Si son citas separadas se le indica en el titulo de la fecha
                        if(element.citasSeparadas){
                            element.fullDate = '(Citas Separadas)'
                        }else{
                            element.fullDate = dia + ' de ' + months[mes] + ' del ' + año + ' a las ' + element.hora
                        }
                        // Comprobando status
                        if (element.status == 'Pendiente'){
                            element.statusIcon = 'warning'
                            element.statusColor = 'warning'
                        }else if (element.status == 'Rechazado') {
                            element.statusIcon = 'error'
                            element.statusColor = 'error'
                        }else if (element.status == 'Confirmado') {
                            element.statusIcon = 'done_all'
                            element.statusColor = 'success'
                        }else if (element.status == 'Proceso') {
                            element.statusIcon = 'done'
                            element.statusColor = 'orange darken-2'
                        }
                        // Añadir una id a cada paciente, que cagado
                        element.pacientes.forEach(paciente => {
                            paciente.id = cont++
                            // Cargando fechas
                            if(element.citasSeparadas){
                                let fullDate = new Date(paciente.dataPicker + 'UTC-6')
                                let dia = fullDate.getDate()
                                let mes = fullDate.getMonth()
                                let año = fullDate.getUTCFullYear()
                                paciente.fullDate = dia + ' de ' + months[mes] + ' del ' + año + ' a las ' + paciente.timePicker
                            }
                        })
                    }
                })
                return dates
            },
            sortCitas () {
                const citas = getLoadedDates
            }
        },
        methods: {
        },
        created () {
        }
    }
    /*
                    <v-flex xs12 md4>
                        <!-- progress card -->
                        <v-card color="warning" class="mb-2">
                            <v-card-title primary-title>
                                <v-flex xs12>
                                    <v-layout row >
                                        <span>14 de Diciembre del 2018 a las 9:00 pm</span>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12 mt-2>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <span class="white--text">Paciente(s): </span>
                                        </v-flex>
                                        <v-flex xs12>
                                            <span>- Alma Marcela Silva de Alegria</span>
                                        </v-flex>
                                        <v-flex xs12>
                                            <span>- Rosa Melano Moreno</span>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12 text-xs-center mt-1>
                                    Status: Pendiente
                                    <v-icon small>warning</v-icon>
                                </v-flex>
                                <v-btn color="info" block>Detalles</v-btn>
                            </v-card-title>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 md4>
                        <!-- success card -->
                        <v-card color="success" class="mb-2">
                            <v-card-title primary-title>
                                <v-flex xs12>
                                    <v-layout row >
                                        <span>14 de Diciembre del 2018 a las 9:00 pm</span>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12 mt-2>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <span class="white--text">Paciente(s): </span>
                                        </v-flex>
                                        <v-flex xs12>
                                            <span>- Alma Marcela Silva de Alegria</span>
                                        </v-flex>
                                        <v-flex xs12>
                                            <span>- Rosa Melano Moreno</span>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12 text-xs-center mt-1>
                                    Status: Confirmado
                                    <v-icon small>done</v-icon>
                                </v-flex>
                                <v-btn color="info" block>Detalles</v-btn>
                            </v-card-title>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 md4>
                        <!-- rejected card -->
                        <v-card color="error">
                            <v-card-title primary-title>
                                <v-flex xs12>
                                    <v-layout row >
                                        <span>14 de Diciembre del 2018 a las 9:00 pm</span>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12 mt-2>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <span class="white--text">Paciente(s): </span>
                                        </v-flex>
                                        <v-flex xs12>
                                            <span>- Alma Marcela Silva de Alegria</span>
                                        </v-flex>
                                        <v-flex xs12>
                                            <span>- Rosa Melano Moreno</span>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12 text-xs-center mt-1>
                                    Status: Rechazado
                                    <v-icon small>error</v-icon>
                                </v-flex>
                                <v-btn color="info" block>Detalles</v-btn>
                            </v-card-title>
                        </v-card>
                    </v-flex>
    */
</script>
