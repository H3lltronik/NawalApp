import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedTherapys: [
            'Terapia 1',
            'Terapia 2',
            'Terapia 3',
            'Terapia 4',
            'Terapia 5',
        ],
        loadedDates: [

        ],
        meses: [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        wantedId: '',
        user: null,
        registration: null,
        loading: false
    },
    getters: {
        getLoadedTherapys (state) {
            return state.loadedTherapys
        },
        getLoadedDates (state) {
            return state.loadedDates
        },
        getMonths (state) {
            return state.meses
        },
        getDate (state) {
            return state.loadedDates.find((aux) => {
                return aux.id == state.wantedId
            })
        },
        getUser (state) {
            return state.user
        },
        getRegistrationState (state) {
            return state.registration
        },
        getLoading (state) {
            return state.loading
        }
    },
    mutations: {
        setLoadedDates (state, arrayDates) {
            state.loadedDates = arrayDates
        },
        sortLoadedDates (state) {
            state.loadedDates.sort((a,b) => {
                a = new Date(a.dia + ' ' + a.hora)
                b = new Date(b.dia + ' ' + b.hora)
                return a - b
            })
        },
        setWantedId (state, wanted) {
            state.wantedId = wanted
        },
        updateLocalDate (state, newData) {
            let aux = state.loadedDates.find(aux => {
                return aux.id == newData.id
            })
            aux = newData
        },
        setUser (state, newUser) {
            state.user = newUser
        },
        setRegistrationState (state, registration) {
            state.registration = registration
        },
        setLoading (state, newState) {
            state.loading = newState
        }
    },
    actions: {
        registerCita ({commit}, payload) {
            commit('setLoading', true)
            commit('setRegistrationState', null)
            firebase.database().ref('/citas').push(payload)
            .then(response => {
                commit('setLoading', false)
                commit('setRegistrationState', true)
            }).catch(error => {
                commit('setLoading', false)
                commit('setRegistrationState', false)
            })
        },
        loadCitas ({commit}) {
            firebase.database().ref('/citas').on('value', function (snapshot) {
                let dates = []
                snapshot.forEach(function(childSnapshot) {
                    dates.push(
                        {
                            id: childSnapshot.key,
                            dia: childSnapshot.val().dia,
                            hora: childSnapshot.val().hora,
                            pacientes: childSnapshot.val().pacientes,
                            extra: childSnapshot.val().extra,
                            status: childSnapshot.val().status,
                            citasSeparadas: childSnapshot.val().citasSeparadas
                        }
                    )
                })
                commit('setLoadedDates', dates)
                commit('sortLoadedDates')
            })
        },
        setWantedId ({commit}, id) {
            commit('setWantedId', id)
        },
        saveCita ({commit}, newData) {
            commit('setLoading', true)
            firebase.database().ref('/citas').child(newData.id).remove()
            .then(() => {
                firebase.database().ref('/citas').child(newData.id).set(newData)
                .then(() => {
                    firebase.database().ref('/citas').child(newData.id).child('id').remove()
                    .then(() => {
                    }).catch(error => {
                        commit('setLoading', false)
                        console.log(error)
                    })
                    commit('setLoading', false)
                    commit('updateLocalDate', newData)
                }).catch(error => {
                    commit('setLoading', false)
                    console.log(error)
                })
            }).catch(error => {
                commit('setLoading', false)
                console.log(error)
            })
        },
        onDelete ({commit}, id) {
            commit('setLoading', true)
            firebase.database().ref('/citas').child(id).remove()
            .then(() => {
                commit('setLoading', false)
            }).catch(error => {
                commit('setLoading', false)
                console.log(error)
            })
        },
        signIn ({commit}, user) {
            commit('setLoading', true)
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(res => {
                commit('setLoading', false)
                const newUser = {
                    id: res.uid,
                    email: user.email
                }
                commit('setUser', newUser)
            }).catch(error => {
                commit('setLoading', false)
                console.log(error)
            })
        },
        logout ({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
        },
        autoSignIn ({commit}, user) {
            commit('setUser', user)
        }
    }
})