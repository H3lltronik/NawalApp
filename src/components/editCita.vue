<template>
    <v-flex xs4 sm2>
        <v-dialog
            v-model="dialog"
            scrollable fullscreen transition="dialog-bottom-transition">
            <v-btn color="blue darken-1" flat slot="activator" left>Editar</v-btn>
            <v-card>
                <!-- Aparentemente, para hacer scrollable la wea el titulo va en un layout -->
                <v-layout row class="pb-4">
                    <v-flex xs12>
                        <v-toolbar dark>
                            <v-btn dark fab small @click="dialog = false"><v-icon small>close</v-icon></v-btn>
                            <v-toolbar-title>Editando Cita</v-toolbar-title>
                        </v-toolbar>
                    </v-flex>
                </v-layout>
                <v-divider class="mt-4"></v-divider>
                <v-card-text>
                    <shared-register-dates-form :editingDate="true" :editableDate="editableDate"
                    :reload="!dialog">
                    </shared-register-dates-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        props: ['editableDate'],
        data () {
            return {
                dialog: false,
                reload: false
            }
        },
        methods: {
        },
        watch: {
            loading (oldVal, newVal) {
                if (oldVal === true && newVal === false){
                    
                }
            }
        },
        computed: {
            loading () {
                return this.$store.getters.getLoading
            }
        }
    }
</script>