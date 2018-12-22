<template>
    <v-container grid-list-xs>
        <v-layout row wrap justify-center >
            <v-flex xs12 sm10 md6>
                <v-card raised elevation-19>
                    <v-layout row wrap justify-center>
                        <v-card-title primary-title>
                            <div class="headline">Ingreso</div>
                        </v-card-title>
                    </v-layout>
                    <v-card-text>
                        <form @click.prevent="">
                            <v-flex xs12>
                                <v-text-field
                                    name="correo"
                                    label="Correo"
                                    id="correo"
                                    v-model="user.email"
                                    box
                                    clearable
                                    required
                                    prepend-inner-icon="email"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    v-model="user.password"
                                    box
                                    clearable
                                    required
                                    prepend-inner-icon="lock">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-btn block dark @click="onSignIn" :loading="loading">
                                    Ingresar
                                    <span slot="loader" class="custom-loader">
                                        <v-icon dark>cached</v-icon>
                                    </span>
                                </v-btn>
                            </v-flex>
                        </form>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data () {
        return {
            user: {
                password: '',
                email: ''
            }
        }
    },
    methods: {
        onSignIn () {
            this.$store.dispatch('signIn', this.user)
        }
    },
    computed: {
        userStore () {
            return this.$store.getters.getUser
        },
        loading () {
            return this.$store.getters.getLoading
        }
    },
    watch: {
        userStore (value) {
            if (value !== null && value !== undefined)  {
                this.$router.push('/viewTherapy')
            }
        }
    }
}
</script>