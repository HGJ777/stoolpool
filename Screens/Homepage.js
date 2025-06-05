import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// FIXED: Universal date formatting function
const formatDate = (dateString) => {
    try {
        if (!dateString) {
            console.warn('No date provided to formatDate');
            return 'No date';
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.warn('Invalid date in HomeScreen:', dateString);
            return 'Invalid Date';
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Date formatting error in HomeScreen:', error, 'for date:', dateString);
        return 'Date Error';
    }
};

// FIXED: Migration function to fix existing bad dates
const fixExistingDates = async () => {
    try {
        const data = await AsyncStorage.getItem('stool_results');
        if (data) {
            const results = JSON.parse(data);
            let hasChanges = false;

            const fixedResults = results.map(entry => {
                if (!entry.date || isNaN(new Date(entry.date).getTime())) {
                    console.log('Fixing bad date:', entry.date);
                    hasChanges = true;
                    return {
                        ...entry,
                        date: new Date().toISOString() // Replace with current time
                    };
                }
                return entry;
            });

            if (hasChanges) {
                await AsyncStorage.setItem('stool_results', JSON.stringify(fixedResults));
                console.log('Fixed existing bad dates in storage');
            }
        }
    } catch (error) {
        console.error('Error fixing dates:', error);
    }
};

export default function HomeScreen({ navigation }) {
    const [stats, setStats] = useState({
        totalLogs: 0,
        lastEntry: null,
        mostCommonResult: null,
        bowelMovementTrend: [],
        mostCommonColor: null,
        mostCommonShape: null,
        mostCommonSmell: null,
        avgPainRating: 0,
        mostCommonFloat: null,
        avgFrequency: 0,
        weeklyAverage: 0,
        dailyAverage: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeData = async () => {
            // Fix any existing bad dates first
            await fixExistingDates();
            // Then load stats
            await loadStats();
        };
        initializeData();
    }, []);

    const loadStats = async () => {
        try {
            const data = await AsyncStorage.getItem('stool_results');
            if (data) {
                const results = JSON.parse(data);
                calculateStats(results);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (results) => {
        if (results.length === 0) {
            setLoading(false);
            return;
        }

        // Total logs
        const totalLogs = results.length;

        // Last entry
        const lastEntry = results[results.length - 1];

        // Most common result
        const resultCounts = {};
        results.forEach(entry => {
            resultCounts[entry.result] = (resultCounts[entry.result] || 0) + 1;
        });
        const mostCommonResult = Object.keys(resultCounts).reduce((a, b) =>
            resultCounts[a] > resultCounts[b] ? a : b
        );

        // Bowel movement trend (last 7 entries) - FIXED date handling
        const recentEntries = results.slice(-7).map(entry => {
            const date = new Date(entry.date);
            return {
                date: isNaN(date.getTime()) ? 'Invalid' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: entry.score || 0
            };
        });

        // Analyze answers for patterns
        const colors = {};
        const shapes = {};
        const smells = {};
        const painRatings = [];
        const floatTypes = {};

        results.forEach(entry => {
            if (entry.answers && Array.isArray(entry.answers)) {
                // Color (index 0)
                if (entry.answers[0]) {
                    colors[entry.answers[0]] = (colors[entry.answers[0]] || 0) + 1;
                }

                // Shape/Consistency (index 1)
                if (entry.answers[1]) {
                    shapes[entry.answers[1]] = (shapes[entry.answers[1]] || 0) + 1;
                }

                // Smell (index 2)
                if (entry.answers[2]) {
                    smells[entry.answers[2]] = (smells[entry.answers[2]] || 0) + 1;
                }

                // Pain (index 3) - object with before, during, after
                if (entry.answers[3] && typeof entry.answers[3] === 'object') {
                    const pain = entry.answers[3];
                    const avgPain = ((pain.before || 0) + (pain.during || 0) + (pain.after || 0)) / 3;
                    painRatings.push(avgPain);
                }

                // Float/Sink (index 4)
                if (entry.answers[4] && typeof entry.answers[4] === 'string') {
                    const floatType = entry.answers[4].split(':')[0].trim();
                    floatTypes[floatType] = (floatTypes[floatType] || 0) + 1;
                }
            }
        });

        // Calculate most common values
        const mostCommonColor = Object.keys(colors).length > 0 ?
            Object.keys(colors).reduce((a, b) => colors[a] > colors[b] ? a : b) : 'N/A';

        const mostCommonShape = Object.keys(shapes).length > 0 ?
            Object.keys(shapes).reduce((a, b) => shapes[a] > shapes[b] ? a : b) : 'N/A';

        const mostCommonSmell = Object.keys(smells).length > 0 ?
            Object.keys(smells).reduce((a, b) => smells[a] > smells[b] ? a : b) : 'N/A';

        const avgPainRating = painRatings.length > 0 ?
            (painRatings.reduce((sum, rating) => sum + rating, 0) / painRatings.length).toFixed(1) : 0;

        const mostCommonFloat = Object.keys(floatTypes).length > 0 ?
            Object.keys(floatTypes).reduce((a, b) => floatTypes[a] > floatTypes[b] ? a : b) : 'N/A';

        // Calculate weekly average - FIXED date handling
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentResults = results.filter(entry => {
            const entryDate = new Date(entry.date);
            return !isNaN(entryDate.getTime()) && entryDate >= oneWeekAgo;
        });
        const weeklyAverage = recentResults.length;

        // Calculate daily average
        const dailyAverage = weeklyAverage / 7;

        setStats({
            totalLogs,
            lastEntry,
            mostCommonResult,
            bowelMovementTrend: recentEntries,
            mostCommonColor,
            mostCommonShape,
            mostCommonSmell,
            avgPainRating,
            mostCommonFloat,
            weeklyAverage,
            dailyAverage
        });
    };

    const getResultColor = (result) => {
        if (result?.includes('immediate')) return '#000';
        if (result?.includes('checkup')) return '#e53935';
        if (result?.includes('diet')) return '#fbc02d';
        return '#43a047';
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading your stats...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>StoolPool Dashboard</Text>
                <Text style={styles.subtitle}>Your digestive health overview</Text>
            </View>

            {stats.totalLogs === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No Data Yet</Text>
                    <Text style={styles.emptyText}>Start tracking your digestive health to see personalized insights!</Text>
                </View>
            ) : (
                <>
                    {/* Overview Cards */}
                    <View style={styles.overviewGrid}>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewNumber}>{stats.totalLogs}</Text>
                            <Text style={styles.overviewLabel}>Total Logs</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewNumber}>{stats.weeklyAverage}</Text>
                            <Text style={styles.overviewLabel}>This Week</Text>
                        </View>
                    </View>

                    {/* Last Entry - FIXED date display */}
                    {stats.lastEntry && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📅 Last Entry</Text>
                            <View style={[styles.card, { borderLeftColor: getResultColor(stats.lastEntry.result) }]}>
                                <Text style={styles.cardDate}>{formatDate(stats.lastEntry.date)}</Text>
                                <Text style={[styles.cardResult, { color: getResultColor(stats.lastEntry.result) }]}>
                                    {stats.lastEntry.result}
                                </Text>
                                <Text style={styles.cardScore}>Score: {stats.lastEntry.score !== undefined ? stats.lastEntry.score : 0}</Text>
                            </View>
                        </View>
                    )}

                    {/* Trend Chart */}
                    {stats.bowelMovementTrend.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📊 Recent Trend (Last 7 entries)</Text>
                            <View style={styles.chartContainer}>
                                {stats.bowelMovementTrend.map((entry, index) => (
                                    <View key={index} style={styles.chartBar}>
                                        <View
                                            style={[
                                                styles.bar,
                                                {
                                                    height: Math.max(20, (entry.score / 20) * 100),
                                                    backgroundColor: entry.score >= 18 ? '#000' :
                                                        entry.score >= 10 ? '#e53935' :
                                                            entry.score >= 5 ? '#fbc02d' : '#43a047'
                                                }
                                            ]}
                                        />
                                        <Text style={styles.chartLabel}>{entry.date}</Text>
                                        <Text style={styles.chartValue}>{entry.score}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Most Common Patterns - FIXED to show 6 items */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎯 Most Common Patterns</Text>

                        <View style={styles.patternCard}>
                            <Text style={styles.patternLabel}>Overall Result:</Text>
                            <Text style={[styles.patternValue, { color: getResultColor(stats.mostCommonResult) }]}>
                                {stats.mostCommonResult}
                            </Text>
                        </View>

                        <View style={styles.patternGrid}>
                            <View style={styles.patternItem}>
                                <Text style={styles.patternEmoji}>🎨</Text>
                                <Text style={styles.patternLabel}>Color</Text>
                                <Text style={styles.patternValue}>{stats.mostCommonColor}</Text>
                            </View>

                            <View style={styles.patternItem}>
                                <Text style={styles.patternEmoji}>📏</Text>
                                <Text style={styles.patternLabel}>Shape</Text>
                                <Text style={styles.patternValue}>{stats.mostCommonShape}</Text>
                            </View>

                            <View style={styles.patternItem}>
                                <Text style={styles.patternEmoji}>👃</Text>
                                <Text style={styles.patternLabel}>Smell</Text>
                                <Text style={styles.patternValue}>{stats.mostCommonSmell}</Text>
                            </View>

                            <View style={styles.patternItem}>
                                <Text style={styles.patternEmoji}>😣</Text>
                                <Text style={styles.patternLabel}>Avg Pain</Text>
                                <Text style={styles.patternValue}>{stats.avgPainRating}/10</Text>
                            </View>

                            <View style={styles.patternItem}>
                                <Text style={styles.patternEmoji}>🌊</Text>
                                <Text style={styles.patternLabel}>Buoyancy</Text>
                                <Text style={styles.patternValue}>{stats.mostCommonFloat}</Text>
                            </View>

                            <View style={styles.patternItem}>
                                <Text style={styles.patternEmoji}>📊</Text>
                                <Text style={styles.patternLabel}>Daily Avg</Text>
                                <Text style={styles.patternValue}>{stats.dailyAverage.toFixed(1)}</Text>
                            </View>
                        </View>
                    </View>
                </>
            )}

            {/* Start Button */}
            <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('Quiz')}
            >
                <Text style={styles.startButtonText}>
                    {stats.totalLogs === 0 ? 'Start First Log →' : 'New Entry →'}
                </Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
        marginTop: 100,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 5,
    },
    overviewGrid: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 10,
    },
    overviewCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    overviewNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    overviewLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    cardResult: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardScore: {
        fontSize: 14,
        color: '#333',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    chartBar: {
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        width: 20,
        borderRadius: 10,
        marginBottom: 8,
    },
    chartLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 2,
    },
    chartValue: {
        fontSize: 11,
        color: '#333',
        fontWeight: 'bold',
    },
    patternCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    patternGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    patternItem: {
        backgroundColor: '#fff',
        width: '31%',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    patternEmoji: {
        fontSize: 20,
        marginBottom: 6,
    },
    patternLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        textAlign: 'center',
    },
    patternValue: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#4CAF50',
        marginHorizontal: 20,
        marginTop: 30,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 24,
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
    bottomSpacer: {
        height: 30,
    },
});