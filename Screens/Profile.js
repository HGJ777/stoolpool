import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [entryCount, setEntryCount] = useState(0);
    const [lastResult, setLastResult] = useState(null);
    const [avgScore, setAvgScore] = useState(0);
    const [mostCommonType, setMostCommonType] = useState('');
    const [entriesThisWeek, setEntriesThisWeek] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            const data = await AsyncStorage.getItem('stool_results');
            if (data) {
                const parsed = JSON.parse(data);
                setEntryCount(parsed.length);
                setLastResult(parsed[parsed.length - 1]);

                const scores = parsed.map(p => p.score);
                setAvgScore((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));

                const typeMap = {};
                parsed.forEach(p => {
                    typeMap[p.result] = (typeMap[p.result] || 0) + 1;
                });
                const mostCommon = Object.entries(typeMap).sort((a, b) => b[1] - a[1])[0];
                setMostCommonType(mostCommon?.[0]);

                const now = new Date();
                const weekStart = new Date(now.setDate(now.getDate() - 6));
                const entriesWeek = parsed.filter(p => new Date(p.date) >= weekStart);
                setEntriesThisWeek(entriesWeek.length);

                const dates = parsed.map(p => p.date.split('T')[0]);
                const uniqueDays = [...new Set(dates)].reverse();
                let s = 0;
                let current = new Date();
                for (let d of uniqueDays) {
                    if (d === current.toISOString().split('T')[0]) {
                        s++;
                        current.setDate(current.getDate() - 1);
                    } else {
                        break;
                    }
                }
                setStreak(s);
            }
        };
        loadData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.Setting}>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="settings-outline" size={26} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.navigate('Info', { type: 'username' })}>
                    <Text style={styles.title}>James123</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.infoBar} onPress={() => navigation.navigate('Info', { type: 'email' })}>
                <Text style={styles.info}>Email: <Text style={styles.value}>James123@gmail.com</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoBar} onPress={() => navigation.navigate('Info', { type: 'totalEntries' })}>
                <Text style={styles.info}>Total Entries: <Text style={styles.value}>{entryCount}</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoBar} onPress={() => navigation.navigate('Info', { type: 'entriesThisWeek' })}>
                <Text style={styles.info}>Entries This Week: <Text style={styles.value}>{entriesThisWeek}</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoBar} onPress={() => navigation.navigate('Info', { type: 'streak' })}>
                <Text style={styles.info}>Streak: <Text style={styles.value}>{streak} day{streak === 1 ? '' : 's'}</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoBar} onPress={() => navigation.navigate('Info', { type: 'avgScore' })}>
                <Text style={styles.info}>Average Score: <Text style={styles.value}>{avgScore}</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoBar} onPress={() => navigation.navigate('Info', { type: 'mostCommonType' })}>
                <Text style={styles.info}>Most Common Type: <Text style={styles.value}>{mostCommonType}</Text></Text>
            </TouchableOpacity>

            {lastResult && (
                <View style={styles.lastEntry}>
                    <Text style={styles.subtitle}>🕓 Last Entry:</Text>
                    <Text style={{ color: lastResult.color }}>Status: {lastResult.result}</Text>
                    <Text>Date: {lastResult.date}</Text>
                    <Text>Score: {lastResult.score}</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 30
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
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    Setting: {
        position: 'absolute',
        right: 0,
        zIndex: 1,
    },
    infoBar: {
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
    }
});
