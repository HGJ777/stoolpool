import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InfoScreen({ route, navigation }) {
    const { type } = route.params;

    let title = '';
    let description = '';

    switch (type) {
        case 'email':
            title = 'Email';
            description = 'This is the email tied to your account.';
            break;
        case 'username':
            title = 'Username';
            description = 'This is your display name, visible only to you.';
            break;
        case 'totalEntries':
            title = 'Total Entries';
            description = 'The total number of stool logs you’ve recorded.';
            break;
        case 'entriesThisWeek':
            title = 'Entries This Week';
            description = 'Number of logs recorded in the past 7 days.';
            break;
        case 'streak':
            title = 'Streak';
            description = 'How many days in a row you’ve logged entries.';
            break;
        case 'avgScore':
            title = 'Average Score';
            description = 'Average health score of your logs over time.';
            break;
        case 'mostCommonType':
            title = 'Most Common Type';
            description = 'The stool type (e.g., color or consistency) you log most often.';
            break;
        case 'lastEntry':
            title = 'Last Entry';
            description = 'Details of your most recent log entry.';
            break;
        default:
            title = 'Unknown';
            description = 'No information available for this item.';
            break;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={26} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 100,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#555',
    },
});
