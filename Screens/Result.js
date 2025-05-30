import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getScore = (answers) => {
    let score = 0;

    const blackFlags = [
        "Black", "Black tar-like", "Pus", "Worms/parasite",
        "Fat globules", "Undigested food", "Very Foul", "Only with laxatives"
    ];
    const redFlags = [
        "Red", "Dark/red streaks", "Bright red blood", "Burning",
        "Pain after", "Pain before poop", "Random abdominal pain",
        "More than 6x/day", "Sweet", "Chemical", "Rotten"
    ];
    const yellowFlags = [
        "Sticky", "Oily", "Foamy", "Floated", "Yellow", "Yellow mucus",
        "Only on toilet paper", "Mild cramp", "Only during strain"
    ];

    answers.forEach(ans => {
        if (blackFlags.includes(ans)) score += 5;
        else if (redFlags.includes(ans)) score += 3;
        else if (yellowFlags.includes(ans)) score += 1;
    });

    return score;
};

const getResultDetails = (score) => {
    if (score >= 18) return { color: 'black', message: '❗ Take immediate medical attention!' };
    if (score >= 10) return { color: 'red', message: '⚠️ Go for a medical checkup.' };
    if (score >= 5) return { color: 'yellow', message: '🟡 Watch your diet.' };
    return { color: 'green', message: '✅ You’re in the clear!' };
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
                parsed.push({ date, result: message, color, score });
                await AsyncStorage.setItem('stool_results', JSON.stringify(parsed));
            } catch (err) {
                console.error('❌ Error saving result:', err);
            }
        };
        saveResult();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your StoolPool Result</Text>

            <View style={[styles.resultBox, { borderColor: colorMap[color] }]}>
                <Text style={styles.score}>Score: {score}</Text>
                <Text style={[styles.resultMessage, { color: colorMap[color] }]}>{message}</Text>
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Quiz')}>
                    <Text style={styles.btnText}>🔁 Retake Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('History')}>
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
