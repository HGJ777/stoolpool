import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ResultScreen({ route }) {
    const { answers } = route.params;
    const [result, setResult] = useState("");

    useEffect(() => {
        const outcome = analyzeAnswers(answers);
        setResult(outcome);
    }, []);

    const analyzeAnswers = (answers) => {
        const tags = [];

        // Match answers to diagnostic tags
        const matchTag = (answer, map) => {
            for (const key in map) {
                if (key.toLowerCase() === answer.toLowerCase()) {
                    tags.push(...map[key]);
                }
            }
        };

        // Mapping system (basic rule engine)
        matchTag(answers[0], {
            "Black": ["Upper GI Bleed"],
            "Red": ["Lower GI Bleed"],
            "White/Clay": ["Bile Obstruction"],
            "Green": ["Fast Transit Time"],
            "Yellow": ["Fat Malabsorption"],
        });

        matchTag(answers[1], {
            "Watery": ["Infection", "Diarrhea"],
            "Hard": ["Constipation"],
            "Sticky": ["Mucus presence"],
            "Oily": ["Fat Malabsorption"],
        });

        matchTag(answers[2], {
            "Very Foul": ["Infection"],
            "Sweet": ["Clostridium"],
            "Chemical": ["Medication Reaction"],
        });

        matchTag(answers[3], {
            "4+ times/day": ["Diarrhea"],
            "More than 6x/day": ["Severe Diarrhea"],
            "Only with laxatives": ["Chronic Constipation"],
            "Rarely": ["Irregular Bowel Movement"],
        });

        matchTag(answers[4], {
            "Burning": ["IBD"],
            "Sharp pain": ["IBS"],
            "Pain before poop": ["IBS"],
            "Only during strain": ["Constipation"],
        });

        matchTag(answers[5], {
            "Bright red blood": ["Hemorrhoids", "Rectal Tear"],
            "Black tar-like": ["Upper GI Bleed"],
            "Mucus with blood": ["IBD"],
        });

        matchTag(answers[6], {
            "Floated": ["Fat Malabsorption"],
            "Stuck to bowl": ["Fat or Mucus"],
        });

        matchTag(answers[7], {
            "Clear mucus": ["IBS"],
            "Yellow mucus": ["Infection"],
            "Worms/parasite": ["Parasitic Infection"],
        });

        // Count tags and find most frequent
        const count = {};
        for (const tag of tags) {
            count[tag] = (count[tag] || 0) + 1;
        }

        const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);

        if (sorted.length === 0) return "No notable issues detected based on the answers.";

        // Top result + secondary possibilities
        const top = sorted[0][0];
        const others = sorted.slice(1, 3).map((item) => item[0]).join(", ");

        return `🔍 Most likely issue: ${top}${others ? `\n📌 Also possible: ${others}` : ""}`;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Result 🧠</Text>
            <Text style={styles.resultText}>{result}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    resultText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});
