import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);

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

        const reversedBack = [...updated].reverse();
        await AsyncStorage.setItem("stool_results", JSON.stringify(reversedBack));
    };

    const formatPainData = (painObj) => {
        if (!painObj || typeof painObj !== 'object') return 'No pain data';
        return `Before: ${painObj.before}/10, During: ${painObj.during}/10, After: ${painObj.after}/10`;
    };

    const formatFloatData = (floatStr) => {
        if (!floatStr || typeof floatStr !== 'string') return 'No float data';
        const [type, details] = floatStr.split(':');
        return `${type.trim()}${details ? ` - ${details.trim()}` : ''}`;
    };

    const getQuestionLabels = () => [
        '🎨 Color',
        '📏 Shape/Consistency',
        '👃 Smell',
        '😣 Pain Level',
        '🌊 Float/Sink',
        '📝 Appearance Notes'
    ];

    // 👉 Detail View
    if (selectedEntry !== null) {
        const questionLabels = getQuestionLabels();

        return (
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity
                    style={styles.backButtonContainer}
                    onPress={() => setSelectedEntry(null)}
                >
                    <Text style={styles.backButton}>← Back to History</Text>
                </TouchableOpacity>

                <Text style={styles.detailTitle}>📄 Detailed Report</Text>

                {/* Header Info */}
                <View style={styles.headerCard}>
                    <View style={styles.headerRow}>
                        <View style={[styles.statusDot, { backgroundColor: selectedEntry.color }]} />
                        <View style={styles.headerText}>
                            <Text style={styles.headerDate}>{selectedEntry.date}</Text>
                            <Text style={[styles.headerResult, { color: selectedEntry.color }]}>
                                {selectedEntry.result}
                            </Text>
                        </View>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreNumber}>{selectedEntry.score || 0}</Text>
                            <Text style={styles.scoreLabel}>Score</Text>
                        </View>
                    </View>
                </View>

                {/* Symptoms Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>🩺 Recorded Symptoms</Text>

                    {selectedEntry.answers && selectedEntry.answers.length > 0 ? (
                        selectedEntry.answers.slice(0, 5).map((answer, index) => {
                            if (answer === null || answer === undefined || answer === '') {
                                return (
                                    <View key={index} style={styles.symptomRow}>
                                        <Text style={styles.symptomLabel}>{questionLabels[index] || `Question ${index + 1}`}</Text>
                                        <Text style={styles.skippedText}>Skipped</Text>
                                    </View>
                                );
                            }

                            // Handle Pain Level (index 3) - Show as separate sections
                            if (index === 3 && typeof answer === 'object' && answer.before !== undefined) {
                                return (
                                    <View key={index} style={styles.painSection}>
                                        <Text style={styles.symptomLabel}>{questionLabels[index]}</Text>
                                        <View style={styles.painBreakdown}>
                                            <View style={styles.painItem}>
                                                <Text style={styles.painSubLabel}>Before:</Text>
                                                <Text style={styles.painValue}>{answer.before || 0}/10</Text>
                                            </View>
                                            <View style={styles.painItem}>
                                                <Text style={styles.painSubLabel}>During:</Text>
                                                <Text style={styles.painValue}>{answer.during || 0}/10</Text>
                                            </View>
                                            <View style={styles.painItem}>
                                                <Text style={styles.painSubLabel}>After:</Text>
                                                <Text style={styles.painValue}>{answer.after || 0}/10</Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }

                            // Handle Float/Sink (index 4) - Show properly formatted
                            if (index === 4 && typeof answer === 'string') {
                                let displayValue = '';
                                if (answer.includes(':')) {
                                    const [type, details] = answer.split(':');
                                    const cleanDetails = details.trim();
                                    if (cleanDetails && cleanDetails !== '' && cleanDetails !== ' ') {
                                        displayValue = `${type.trim()}: ${cleanDetails}`;
                                    } else {
                                        displayValue = type.trim();
                                    }
                                } else {
                                    displayValue = answer;
                                }

                                return (
                                    <View key={index} style={styles.symptomRow}>
                                        <Text style={styles.symptomLabel}>{questionLabels[index]}</Text>
                                        <Text style={styles.symptomValue}>{displayValue}</Text>
                                    </View>
                                );
                            }

                            // Handle all other answers (Color, Shape, Smell, Notes)
                            let displayValue = '';
                            if (typeof answer === 'object') {
                                // If it's an unexpected object, show debug info
                                displayValue = `Debug: ${JSON.stringify(answer)}`;
                            } else {
                                // Regular string data
                                displayValue = answer.toString();
                            }

                            return (
                                <View key={index} style={styles.symptomRow}>
                                    <Text style={styles.symptomLabel}>{questionLabels[index] || `Question ${index + 1}`}</Text>
                                    <Text style={styles.symptomValue}>{displayValue}</Text>
                                </View>
                            );
                        })
                    ) : (
                        <View>
                            <Text style={styles.noDataText}>No symptom data available for this entry</Text>
                            <Text style={styles.debugText}>
                                Debug: This entry was likely saved before the update. New entries will show full details.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Personal Notes Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>📝 Personal Notes</Text>
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesText}>
                            {selectedEntry.answers && selectedEntry.answers[5]
                                ? selectedEntry.answers[5]
                                : "No additional notes recorded"}
                        </Text>
                    </View>
                </View>

                {/* Health Insights */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>💡 Health Insights</Text>
                    <View style={styles.insightsContainer}>
                        {selectedEntry.score >= 18 && (
                            <Text style={styles.insightCritical}>
                                ⚠️ This score indicates potential serious concerns. Please seek immediate medical attention.
                            </Text>
                        )}
                        {selectedEntry.score >= 10 && selectedEntry.score < 18 && (
                            <Text style={styles.insightWarning}>
                                🟡 This score suggests you should consider a medical checkup for your digestive health.
                            </Text>
                        )}
                        {selectedEntry.score >= 5 && selectedEntry.score < 10 && (
                            <Text style={styles.insightModerate}>
                                🍎 Consider reviewing your diet and lifestyle habits.
                            </Text>
                        )}
                        {selectedEntry.score < 5 && (
                            <Text style={styles.insightGood}>
                                ✅ Your digestive health appears to be in good condition.
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        );
    }

    // 🗂 Default List View
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
                style={styles.backButtonContainer}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>📜 Your Health History</Text>
            <Text style={styles.subtitle}>Tap any entry to view detailed information</Text>

            {history.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No Records Yet</Text>
                    <Text style={styles.emptyText}>Start tracking your digestive health to build your personal history!</Text>
                </View>
            ) : (
                <View style={styles.historyList}>
                    {history.map((entry, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.historyCard}
                            onPress={() => setSelectedEntry(entry)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.colorDot, { backgroundColor: entry.color }]} />
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardDate}>
                                            {new Date(entry.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Text>
                                        <Text style={styles.cardResult} numberOfLines={1}>
                                            {entry.result}
                                        </Text>
                                        <Text style={styles.cardScore}>Score: {entry.score || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.cardActions}>
                                        <Text style={styles.viewMore}>View Details →</Text>
                                        <TouchableOpacity
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                deleteEntry(index);
                                            }}
                                            style={styles.deleteButton}
                                        >
                                            <Text style={styles.deleteText}>🗑️</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        flexGrow: 1,
        paddingTop: 60,
    },
    backButtonContainer: {
        marginBottom: 20,
    },
    backButton: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: '500',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
    },
    detailTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    historyList: {
        gap: 12,
    },
    historyCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardDate: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    cardResult: {
        fontSize: 16,
        color: '#666',
        marginBottom: 2,
    },
    cardScore: {
        fontSize: 13,
        color: '#888',
    },
    cardActions: {
        alignItems: 'flex-end',
    },
    viewMore: {
        fontSize: 12,
        color: '#007bff',
        marginBottom: 8,
    },
    deleteButton: {
        padding: 4,
    },
    deleteText: {
        fontSize: 16,
    },
    // Detail View Styles
    headerCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 15,
    },
    headerText: {
        flex: 1,
    },
    headerDate: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    headerResult: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scoreContainer: {
        alignItems: 'center',
        paddingLeft: 15,
    },
    scoreNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    scoreLabel: {
        fontSize: 12,
        color: '#666',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    symptomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    symptomLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        flex: 1,
    },
    symptomValue: {
        fontSize: 14,
        color: '#333',
        flex: 2,
        textAlign: 'right',
    },
    skippedText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        flex: 2,
        textAlign: 'right',
    },
    noDataText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    notesContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
    },
    notesText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    insightsContainer: {
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    insightCritical: {
        fontSize: 14,
        color: '#d32f2f',
        lineHeight: 20,
    },
    insightWarning: {
        fontSize: 14,
        color: '#f57c00',
        lineHeight: 20,
    },
    insightModerate: {
        fontSize: 14,
        color: '#1976d2',
        lineHeight: 20,
    },
    insightGood: {
        fontSize: 14,
        color: '#388e3c',
        lineHeight: 20,
    },
    painSection: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    painBreakdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingLeft: 10,
    },
    painItem: {
        alignItems: 'center',
    },
    painSubLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    painValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    debugText: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 5,
    },
    bottomSpacer: {
        height: 30,
    },
});