<template>
    <v-dialog
        v-model="dialog"
        scrollable 
        :overlay="false"
        max-width="500px"
        transition="dialog-transition">
        <v-btn color="error" flat slot="activator" v-if="small" fab right>
            <v-icon left>delete</v-icon>
            <div right>Eliminar</div>
        </v-btn>
        <v-btn color="error" flat slot="activator" v-else>
            <v-icon left>delete</v-icon>
            <div right>Eliminar</div>
        </v-btn>
        <v-card>
            <v-layout row wrap justify-center>
                <v-card-title primary-title>
                    <div class="headline">¿Estas segura de que deseas eliminar?</div>
                </v-card-title>
            </v-layout>
            <v-divider></v-divider>
            <v-card-text>
                <v-layout row wrap align-center justify-space-between>
                    <v-flex xs3>
                        <v-btn color="info" flat @click="dialog = false">
                            Cancelar
                            </v-btn>
                    </v-flex>
                    <v-flex xs5>
                        <v-btn color="error" flat @click="onDelete">
                            <div>Borrar</div>
                            </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: ['selectedCita', 'small'],
        data () {
            return {
                dialog: false
            }
        },
        methods: {
            onDelete () {
                this.$store.dispatch('onDelete', this.selectedCita.id)
            }
        }
    }
</script>