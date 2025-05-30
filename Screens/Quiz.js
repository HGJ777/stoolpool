import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const questions = [
    {
        id: 1,
        question: "What color was your stool?",
        options: ["Brown", "Black", "Red", "Yellow", "Green", "White/Clay", "Grey", "Other"],
    },
    {
        id: 2,
        question: "What was the consistency?",
        options: ["Hard", "Lumpy", "Formed", "Soft", "Mushy", "Watery", "Sticky", "Oily"],
    },
    {
        id: 3,
        question: "Did it have a strong or unusual odor?",
        options: ["Normal", "Mild", "Strong", "Very Foul", "Sweet", "Chemical", "Rotten", "Fishy"],
    },
    {
        id: 4,
        question: "How often are your bowel movements?",
        options: ["1x/day", "2-3x/day", "4+ times/day", "Every other day", "Few times a week", "Rarely", "More than 6x/day", "Only with laxatives"],
    },
    {
        id: 5,
        question: "Was there any pain or cramping?",
        options: ["No pain", "Mild cramp", "Sharp pain", "Burning", "Pain before poop", "Pain after", "Random abdominal pain", "Only during strain"],
    },
    {
        id: 6,
        question: "Did you see any blood?",
        options: ["No", "Bright red blood", "Dark/red streaks", "Black tar-like", "Mucus with blood", "Tiny spots", "Only on toilet paper", "Not sure"],
    },
    {
        id: 7,
        question: "Did it float or sink?",
        options: ["Floated", "Sank fast", "Sank slowly", "Stuck to bowl", "Foamy", "Layered", "Mixed", "Didn't notice"],
    },
    {
        id: 8,
        question: "Was there mucus, pus, or anything unusual?",
        options: ["Clear mucus", "Yellow mucus", "No mucus", "Pus", "Worms/parasite", "Fat globules", "Undigested food", "Other"],
    }
];

export default function QuizScreen({ navigation }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);

    const handleAnswer = (option) => {
        const updatedAnswers = [...answers, option];
        if (currentIndex + 1 < questions.length) {
            setAnswers(updatedAnswers);
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate("Result", { answers: updatedAnswers });
        }
    };

    const currentQuestion = questions[currentIndex];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.question}>{currentQuestion.question}</Text>
            {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.option}
                    onPress={() => handleAnswer(option)}
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 100,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    question: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    option: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 12,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});
