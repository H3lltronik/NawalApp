<template>
    <form @submit.prevent="">
        <v-layout row wrap justify-center>
            <v-flex xs12 v-for="n in nPacientes" :key="n">
                <v-flex xs12>
                    <v-divider v-if="n > 1" color="black"></v-divider>
                    <v-layout row wrap>
                        <v-subheader>Paciente {{n}}</v-subheader>
                        <v-spacer></v-spacer>
                        <v-btn color="error" fab style="width: 30px; height: 30px;" @click="removePaciente(n-1)" v-if="variosPacientes">
                            <v-icon>remove</v-icon>
                            </v-btn>
                    </v-layout>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                    v-model="pacientes[n-1].name"
                        name="clientName"
                        label="Cliente"
                        placeholder="Alma Marcela Silva de Alegria"
                        id="clientName"
                        required
                        box
                        clearable>
                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                    v-model="pacientes[n-1].phone"
                        name="clientPhone"
                        label="Telefono"
                        placeholder="3317354536"
                        id="clientPhone"
                        box
                        clearable
                        
                        mask="##########">
                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="pacientes[n-1].email"
                        name="clientEmail"
                        label="Correo"
                        id="clientEmail"
                        placeholder="example@gmail.com"
                        :rules="[rules.email]"
                        box
                        clearable>
                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-select
                        box
                        :items="therapys"
                        v-model="pacientes[n-1].therapy"
                        label="Terapia">
                    <option v-for="item in select" v-bind:value="item" :key="item">
                        {{ item }}
                    </option>
                    </v-select>
                </v-flex>
                <!-- Hora individual de cada paciente -->
                <v-layout xs12 v-if="citasSeparadas && variosPacientes" justify-center row wrap>
                    <v-flex xs12 sm5 mb-4 text-xs-center>
                        <v-date-picker :landscape="false" v-model="pacientes[n-1].dataPicker" color="purple" locale="es-ES">
                        </v-date-picker>
                    </v-flex>
                    <v-flex xs12 sm5 text-xs-center>
                        <v-time-picker :landscape="false" v-model="pacientes[n-1].timePicker" format="24hr"></v-time-picker>
                    </v-flex>
                </v-layout>
                <!-- v-if="n == nPacientes" solo al ultimo paciente le aparece el boton de añadir -->
            </v-flex>
            <v-layout row wrap align-center justify-space-between>
                <v-flex :xs6="variosPacientes" :xs12="!variosPacientes" text-xs-center>
                    <v-btn color="info" @click="addPaciente" block>
                        <v-icon left>add</v-icon>
                        <div right class="pr-2">Añadir Paciente</div>
                    </v-btn>
                </v-flex>
                <v-flex xs6 sm3 pl-2 v-if="variosPacientes">
                    <v-switch label="Citas separadas" v-model="citasSeparadas" color="blue"></v-switch>
                </v-flex>
            </v-layout>
            <v-flex xs12 mb-4>
                <v-divider color="black"></v-divider>
            </v-flex>
            <v-flex xs12>                            
                <v-textarea
                    name="infoExtra"
                    label="Informacion Extra"
                    id="infoExtra"
                    v-model="infoExtra"
                    box
                    clearable>
                </v-textarea>
            </v-flex>
            <v-layout v-if="!citasSeparadas || !variosPacientes" justify-center row wrap>
                <v-flex xs12 sm5 mb-4 text-xs-center>
                    <v-date-picker :landscape="false" v-model="dataPicker" color="purple" locale="es-ES">
                    </v-date-picker>
                </v-flex>
                <v-flex xs12 sm5 text-xs-center>
                    <v-time-picker :landscape="false" v-model="timePicker" format="24hr"></v-time-picker>
                </v-flex>
            </v-layout>
            <v-flex xs12 mt-5 text-xs-center>
                <v-btn color="success" type="submit" @click="registerCita" block v-if="!editingDate" :loading="loading">
                    <v-icon left>edit</v-icon>
                    <div right>Registrar</div>
                    <span slot="loader" class="custom-loader">
                        <v-icon dark>cached</v-icon>
                    </span>
                </v-btn>
                <v-btn color="success" @click="saveChanges" block v-if="editingDate" :loading="loading">
                    <v-icon left>save</v-icon>
                    <div right>Guardar</div>
                    <span slot="loader" class="custom-loader">
                        <v-icon dark>cached</v-icon>
                    </span>
                </v-btn>
            </v-flex>
        </v-layout>
    </form>
</template>

<script>
    export default {
        props: ['editingDate', 'editableDate', 'reload'],
        data () {
            return {
                id: '',
                citasSeparadas: false,
                select: null,
                infoExtra: '',
                dataPicker: new Date().toISOString().substr(0, 10),
                timePicker: '',
                nPacientes: 1,
                pacientes: [
                    {
                        name: '',
                        phone: '',
                        email: '',
                        therapy: '',
                        dataPicker: new Date().toISOString().substr(0, 10),
                        timePicker: ''
                    }
                ],
                rules: {
                    email: value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid e-mail.'
                    }
                }
            }
        },
        created () {
            if (this.editingDate)
                this.reloadRegisteredData ()
            this.timePicker = this.getCurrentTime ()
        },
        methods: {
            getCurrentTime () {
                const currDate = new Date()
                const currTime = currDate.getHours() + ':' + currDate.getMinutes()
                return currTime
            },
            addPaciente () {
                this.nPacientes++
                this.pacientes.push({name: '', phone: '', email: '', therapy: ''})
            },
            removePaciente (index) {
                this.nPacientes--
                console.log(this.pacientes)
                this.pacientes.splice(index, 1)
                // El id de todos los que esten adelante del borrado -1
                let auxCont = 0
                this.pacientes.forEach(element => {
                    if (auxCont++ > index)
                        element.id--
                })
                console.log(this.pacientes)
            },
            registerCita () {
                let context = this
                const cita = {
                    pacientes: this.pacientes,
                    dia: this.dataPicker,
                    hora: this.timePicker,
                    extra: this.infoExtra,
                    status: 'Pendiente',
                    citasSeparadas: context.citasSeparadas
                }
                // Sort por fecha
                console.log(cita)
                if(cita.citasSeparadas){
                    cita.pacientes.sort((a,b) => {
                        a = new Date(a.dataPicker + ' ' + a.timePicker)
                        b = new Date(b.dataPicker + ' ' + b.timePicker)
                        return a - b
                    })
                    // Despues del sort, en la posicion 0 queda el mas cercano
                    // Esa sera la hora de la cita en general
                    cita.dia = cita.pacientes[0].dataPicker
                    cita.hora = cita.pacientes[0].timePicker
                    // Todos los pacientes por default en Pendiente
                    cita.pacientes.forEach(element => {
                        element.status = 'Pendiente'
                    })
                }
                this.$store.dispatch('registerCita', cita)
            },
            reloadRegisteredData () {
                this.$store.dispatch('setWantedId', this.editableDate.id)
                const wea = this.getSelectedDate
                if (this.editingDate){
                    let localePacientes = []
                    this.nPacientes = 0
                    wea.pacientes.forEach(element => {
                        this.addPaciente()
                        const newElement = {
                            dataPicker: element.dataPicker,
                            email: element.email,
                            id: element.id,
                            name: element.name,
                            phone: element.phone,
                            therapy: element.therapy,
                            timePicker: element.timePicker,
                        }
                        localePacientes.push(newElement)
                    });
                    let context = this
                    if(!wea.citasSeparadas){
                        const dia = wea.dia
                        const hora = wea.hora
                        context.dataPicker = dia
                        context.timePicker = hora
                    }
                    this.citasSeparadas = wea.citasSeparadas
                    this.pacientes = localePacientes
                    this.id = this.editableDate.id
                    this.status = wea.status
                    this.infoExtra = wea.extra
                    // Me la hace de pedo porque las fechas individuales de los pacientes
                    // Son undefined al no ser citas separadas
                    this.pacientes.forEach(element => {
                        if(element.dataPicker == undefined || element.dataPicker == null){
                            element.dataPicker = ''
                        }
                        if(element.timePicker == undefined || element.timePicker == null){
                            element.timePicker = ''
                        }
                    })
                }
            },
            saveChanges () {
                const savingDate = {
                    id: this.id,
                    citasSeparadas: this.citasSeparadas,
                    dia: this.dataPicker,
                    extra: this.infoExtra,
                    hora: this.timePicker,
                    pacientes: this.pacientes,
                    status: this.status
                }
                this.$store.dispatch('saveCita', savingDate)
            }

        },
        watch: {
            reload(){
                this.reloadRegisteredData () 
            },
            getRegistrationState (value) {
                if (value !== null && value !== undefined) {
                    if(value){
                        this.$router.push('/viewTherapy')
                    }else{
                        alert('Hubo un error al registrar la cita')
                    }
                }
            }
        },
        computed: {
            therapys () {
                return this.$store.getters.getLoadedTherapys
            },
            variosPacientes () {
                if (this.nPacientes > 1) {
                    return true
                } else {
                    return false
                }
            },
            getSelectedDate () {
                return this.$store.getters.getDate
            },
            getRegistrationState () {
                return this.$store.getters.getRegistrationState
            },
            loading () {
                return this.$store.getters.getLoading
            }
        }
    }
</script>