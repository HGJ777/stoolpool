import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const loadResults = async () => {
            const data = await AsyncStorage.getItem("stool_results");
            if (data) {
                const parsed = JSON.parse(data);
                setHistory(parsed.reverse()); // latest first
            }
        };

        loadResults();
    }, []);

    const deleteEntry = async (indexToRemove) => {
        const updated = [...history];
        updated.splice(indexToRemove, 1);
        setHistory(updated);

        // Reverse back before saving since .reverse() was used earlier
        const reversedBack = [...updated].reverse();
        await AsyncStorage.setItem("stool_results", JSON.stringify(reversedBack));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backButton}>⬅️ Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>📜 Past Results</Text>

            {history.length === 0 ? (
                <Text style={styles.empty}>No saved results yet.</Text>
            ) : (
                history.map((entry, index) => (
                    <View key={index} style={styles.card}>
                        <View style={[styles.colorDot, { backgroundColor: entry.color }]} />
                        <View style={styles.textContainer}>
                            <Text style={styles.date}>{entry.date}</Text>
                            <Text style={styles.summary} numberOfLines={2}>
                                {entry.result}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteEntry(index)}>
                            <Text style={styles.delete}>❌</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingVertical: 50
    },
    backButton: {
        color: '#007bff',
        fontSize: 16,
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    empty: {
        textAlign: 'center',
        color: '#888',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 16,
        marginBottom: 15,
    },
    colorDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 10,
        marginTop: 4,
    },
    textContainer: {
        flex: 1,
    },
    date: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    summary: {
        fontSize: 14,
        color: '#444',
    },
    delete: {
        fontSize: 18,
        marginLeft: 10,
        color: '#e53935',
    },
});
