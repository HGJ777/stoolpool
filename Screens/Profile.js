import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [entryCount, setEntryCount] = useState(0);
    const [lastResult, setLastResult] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await AsyncStorage.getItem('stool_results');
            if (data) {
                const parsed = JSON.parse(data);
                setEntryCount(parsed.length);
                setLastResult(parsed[parsed.length - 1]);
            }
        };
        loadData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Custom top bar with Settings button */}
            <View style={styles.Setting}>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="settings-outline" size={26} color="#333" />
                </TouchableOpacity>
            </View>
            <View style={styles.topBar}>
                <Text style={styles.title}>👤 Profile</Text>
            </View>

            <Text style={styles.info}>Nickname: <Text style={styles.value}>Anonymous Pooper</Text></Text>
            <Text style={styles.info}>Total Entries: <Text style={styles.value}>{entryCount}</Text></Text>

            {lastResult && (
                <View style={styles.lastEntry}>
                    <Text style={styles.subtitle}>🕓 Last Entry:</Text>
                    <Text style={{ color: lastResult.color }}>Status: {lastResult.result}</Text>
                    <Text>Date: {lastResult.date}</Text>
                    <Text>Score: {lastResult.score}</Text>
                </View>
            )}

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile (Coming Soon)</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 60
    },
    title: {
        fontSize: 26, fontWeight: 'bold',
    },
    info: {
        fontSize: 18, marginBottom: 10,
    },
    value: {
        fontWeight: 'bold',
    },
    lastEntry: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    button: {
        marginTop: 30,
        backgroundColor: '#2196f3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    Setting:{
        position: 'absolute',
        top: 50, // or tweak this based on your status bar height
        right: 20,
        zIndex: 1,
    }
});
