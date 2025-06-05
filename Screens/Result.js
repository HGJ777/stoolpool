import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getScore = (answers) => {
    const weights = {
        color: {
            "White": 18, "Yellow": 12, "Green": 4, "Brown": 0, "Red": 12, "Black": 18,
        },
        consistency: {
            "Hard": 2, "Lumpy": 3, "Formed": 0, "Soft": 1, "Mushy": 2, "Watery": 4, "Sticky": 5, "Oily": 6,
        },
        smell: {
            "Normal": 0, "Foul": 2, "Very Foul": 4,
        },
        float: {
            "Float": 2, "Sink": 0,
        },
        floatDetails: {
            "Foamy": 2, "Layered": 2, "Only top": 1, "Partial sink": 1, "Mixed density": 2,
            "Sank fast": 0, "Sank slowly": 1, "Stuck to bowl": 2, "Fell in chunks": 1, "Dense solid": 0,
        },
    };

    let score = 0;
    const [color, consistency, smell, pain, floatAnswer, notes] = answers;

    // Core question scores
    score += weights.color[color] || 0;
    score += weights.consistency[consistency] || 0;
    score += weights.smell[smell] || 0;
    // REMOVED: Don't score the notes - they're just text!

    // Pain scores
    if (typeof pain === 'object') {
        score += pain.before + pain.during + pain.after;
    }

    // Float + floatDetails
    if (typeof floatAnswer === 'string' && floatAnswer.includes(':')) {
        const [type, detailStr] = floatAnswer.split(':');
        score += weights.float[type.trim()] || 0;
        const details = detailStr.split(',').map(d => d.trim());
        details.forEach(detail => {
            score += weights.floatDetails[detail] || 0;
        });
    }

    return score;
};

const getResultDetails = (score) => {
    if (score >= 18) return { color: 'black', message: '❗ Take immediate medical attention!' };
    if (score >= 10) return { color: 'red', message: '⚠️ Go for a medical checkup.' };
    if (score >= 5) return { color: 'yellow', message: '🟡 Watch your diet.' };
    return { color: 'green', message: '✅ You are in the clear!' };
    };

    export default function ResultScreen({ route, navigation }) {
        const { answers } = route.params;
        const score = getScore(answers);
        const { color, message } = getResultDetails(score);

        useEffect(() => {
            const saveResult = async () => {
                try {
                    const existing = await AsyncStorage.getItem('stool_results');
                    const parsed = existing ? JSON.parse(existing) : [];
                    const date = new Date().toLocaleString();

                    // 🔥 IMPORTANT CHANGE: Save the original answers array
                    parsed.push({
                        date,
                        result: message,
                        color,
                        score,
                        answers: answers // ← This saves all the user's quiz choices!
                    });

                    console.log('Saved answers:', answers); // Debug log to verify data

                    await AsyncStorage.setItem('stool_results', JSON.stringify(parsed));
                } catch (err) {
                    console.error('❌ Error saving result:', err);
                }
            };
            saveResult();
        }, [answers, message, color, score]); // Added dependencies

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Your StoolPool Result</Text>

                <View style={[styles.resultBox, { borderColor: colorMap[color] }]}>
                    <Text style={styles.score}>Score: {score}</Text>
                    <Text style={[styles.resultMessage, { color: colorMap[color] }]}>{message}</Text>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Tabs', { screen: 'Quiz' })}>
                        <Text style={styles.btnText}>🔁 Retake Quiz</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Tabs', { screen: 'History' })}>
                        <Text style={styles.btnText}>📚 View History</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const colorMap = {
        black: '#000',
        red: '#e53935',
        yellow: '#fbc02d',
        green: '#43a047',
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 30,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        resultBox: {
            borderWidth: 3,
            padding: 25,
            borderRadius: 12,
            marginBottom: 30,
            width: '100%',
            alignItems: 'center',
        },
        score: {
            fontSize: 20,
            marginBottom: 10,
            fontWeight: '600',
        },
        resultMessage: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        buttons: {
            width: '100%',
            gap: 15,
        },
        btn: {
            backgroundColor: '#2196f3',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
        },
        btnText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 16,
        },
    });