import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Slider from '@react-native-community/slider';

export default function QuizScreen({ navigation }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [sliderValue, setSliderValue] = useState(0);
    const [painValues, setPainValues] = useState({ before: 0, during: 0, after: 0 });
    const [painStep, setPainStep] = useState('before');
    const [smellValue, setSmellValue] = useState(0);
    const [floatType, setFloatType] = useState("Float");
    const [floatDetails, setFloatDetails] = useState([]);
    const [started, setStarted] = useState(false);
    const [textInputValue, setTextInputValue] = useState('');

    const colorLabels = ["White", "Yellow", "Green", "Brown", "Red", "Black"];
    const floatOptions = {
        Float: ["Foamy", "Layered", "Only top", "Partial sink", "Mixed density"],
        Sink: ["Sank fast", "Sank slowly", "Stuck to bowl", "Fell in chunks", "Dense solid"]
    };
    const maxSliderValue = 1000;

    const mapSliderToColor = (value) => {
        const segment = maxSliderValue / colorLabels.length;
        const index = Math.floor(value / segment);
        return colorLabels[Math.min(index, colorLabels.length - 1)];
    };

    const mapSmellToLabel = (value) => {
        if (value < 1) return "Normal";
        if (value < 2) return "Foul";
        return "Very Foul";
    };

    const mapSmellToDescription = (label) => {
        switch (label) {
            case "Normal":
                return "\u2022 Mild or typical odor\n\u2022 Not unusual";
            case "Foul":
                return "\u2022 Sulfur-like\n\u2022 Sour\n\u2022 Fermentation-like";
            case "Very Foul":
                return "\u2022 Rotten eggs\n\u2022 Chemical\n\u2022 Overpowering";
            default:
                return "";
        }
    };

    const handleNext = (answer) => {
        let updatedAnswers = [...answers];

        switch (currentIndex) {
            case 0: // color
            case 1: // consistency
            case 2: // smell
            case 5: // appearance (textInput)
                updatedAnswers.push(answer);
                break;

            case 3: // pain object
                updatedAnswers.push({ ...painValues });
                break;

            case 4: // float + floatDetails
                updatedAnswers.push(`${floatType}: ${floatDetails.join(', ')}`);
                break;

            default:
                updatedAnswers.push(answer);
        }

        setAnswers(updatedAnswers);
        setSliderValue(0);
        setPainValues({ before: 0, during: 0, after: 0 });
        setPainStep('before');
        setSmellValue(0);
        setFloatType("Float");
        setFloatDetails([]);
        setTextInputValue('');

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate("Result", { answers: updatedAnswers });
        }
    };

    const handleSkip = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate("Result", { answers });
        }
    };

    const handleBack = () => {
        if (currentIndex === 0) {
            setStarted(false);
            setCurrentIndex(0);
            setAnswers([]);
            setSliderValue(0);
            setPainValues({ before: 0, during: 0, after: 0 });
            setPainStep('before');
            setSmellValue(0);
            setFloatType("Float");
            setFloatDetails([]);
            setTextInputValue('');
        } else {
            const updatedAnswers = [...answers];
            updatedAnswers.pop();
            setAnswers(updatedAnswers);

            setCurrentIndex(currentIndex - 1);
            setSliderValue(0);
            setPainValues({ before: 0, during: 0, after: 0 });
            setPainStep('before');
            setSmellValue(0);
            setFloatType("Float");
            setFloatDetails([]);
            setTextInputValue('');
        }
    };

    const questions = [
        { id: 1, question: "What color was your stool?", type: "slider" },
        { id: 2, question: "What Shape/Consistency?", options: ["Hard", "Lumpy", "Formed", "Soft", "Mushy", "Watery", "Sticky", "Oily"] },
        { id: 3, question: "Did it have a strong or unusual odor?", type: "smell" },
        { id: 4, question: "Was there any pain or cramping?", type: "pain" },
        { id: 5, question: "Did it float or sink?", type: "floatSink" },
        { id: 6, question: "Anything unusual in appearance?", type: "textInput" }
    ];

    const currentQuestion = questions[currentIndex];
    const selectedColor = mapSliderToColor(sliderValue);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {!started ? (
                        <View style={styles.startScreen}>
                            <Text style={styles.startTitle}>Ready to start the quiz?</Text>
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() => setStarted(true)}
                            >
                                <Text style={styles.startButtonText}>Start Quiz</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                                <Text style={styles.backButtonText}>← Back</Text>
                            </TouchableOpacity>

                            <Text style={currentIndex === 1 ? styles.question2 : styles.question}>
                                {currentQuestion.question}
                            </Text>

                            {currentQuestion.type === "slider" && (
                                <View style={styles.section}>
                                    <Image source={require('../assets/Rectangle 1.png')} style={styles.gradientBar} />
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={0}
                                        maximumValue={maxSliderValue}
                                        step={1}
                                        value={sliderValue}
                                        onValueChange={setSliderValue}
                                        minimumTrackTintColor="transparent"
                                        maximumTrackTintColor="transparent"
                                        thumbTintColor="#000"
                                    />
                                    <TouchableOpacity style={styles.nextButton} onPress={() => handleNext(selectedColor)}>
                                        <Text style={styles.nextButtonText}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {currentQuestion.type === "smell" && (
                                <View style={styles.section}>
                                    <View style={styles.tickArea}>
                                        <View style={styles.smellTrackLine} />
                                        <View style={styles.smellTicksRow}>
                                            <View style={[styles.tickContainer, { left: '-2%' }]}>
                                                <View style={styles.tick} />
                                                <Text style={styles.tickLabel}>Normal</Text>
                                            </View>
                                            <View style={[styles.tickContainer, { left: '2%' }]}>
                                                <View style={styles.tick} />
                                                <Text style={styles.tickLabel}>Foul</Text>
                                            </View>
                                            <View style={[styles.tickContainer, { left: '4%' }]}>
                                                <View style={styles.tick} />
                                                <Text style={styles.tickLabel}>Very Foul</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={0}
                                        maximumValue={2}
                                        step={1}
                                        value={smellValue}
                                        onValueChange={setSmellValue}
                                        minimumTrackTintColor="transparent"
                                        maximumTrackTintColor="transparent"
                                        thumbTintColor="#000"
                                    />
                                    <View style={styles.descriptionBox}>
                                        <Text style={styles.optionText}>{mapSmellToLabel(smellValue)}</Text>
                                        <Text style={styles.descriptionText}>{mapSmellToDescription(mapSmellToLabel(smellValue))}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.nextButton} onPress={() => handleNext(mapSmellToLabel(smellValue))}>
                                        <Text style={styles.nextButtonText}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {currentQuestion.type === "pain" && (
                                <View style={styles.section}>
                                    <View style={styles.painButtons}>
                                        {["before", "during", "after"].map((step) => (
                                            <TouchableOpacity
                                                key={step}
                                                style={[styles.painButton, painStep === step && styles.activePainButton]}
                                                onPress={() => setPainStep(step)}
                                            >
                                                <Text style={styles.optionText}>{step.charAt(0).toUpperCase() + step.slice(1)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    <View style={styles.tickArea}>
                                        <View style={styles.painTrackLine} />
                                        <View style={styles.painTicksRow}>
                                            {[...Array(11).keys()].map((tick) => (
                                                <View
                                                    key={tick}
                                                    style={[
                                                        styles.tickContainer,
                                                        { left: `${(tick / 10) * 100}%`, position: 'absolute', transform: [{ translateX: -1 }] }
                                                    ]}
                                                >
                                                    <View style={styles.tick} />
                                                    <Text style={styles.tickLabel}>{tick}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                    <Slider
                                        style={styles.slider1}
                                        minimumValue={0}
                                        maximumValue={10}
                                        step={1}
                                        value={painValues[painStep]}
                                        onValueChange={(v) => setPainValues({ ...painValues, [painStep]: v })}
                                        minimumTrackTintColor="transparent"
                                        maximumTrackTintColor="transparent"
                                        thumbTintColor="#000"
                                    />
                                    <TouchableOpacity style={styles.nextButton} onPress={() => handleNext()}>
                                        <Text style={styles.nextButtonText}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {currentQuestion.type === "floatSink" && (
                                <View style={styles.section}>
                                    <View style={styles.floatToggleRow}>
                                        {["Float", "Sink"].map((type, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.floatToggleButton,
                                                    floatType === type && styles.activeFloatToggle
                                                ]}
                                                onPress={() => {
                                                    setFloatType(type);
                                                    setFloatDetails([]);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.floatToggleText,
                                                    floatType === type && styles.activeFloatToggleText
                                                ]}>
                                                    {type}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <View style={styles.optionsContainer}>
                                        {floatOptions[floatType].map((detail, idx) => {
                                            const selected = floatDetails.includes(detail);
                                            return (
                                                <TouchableOpacity
                                                    key={idx}
                                                    style={styles.checklistItem}
                                                    onPress={() => {
                                                        if (selected) {
                                                            setFloatDetails(floatDetails.filter(d => d !== detail));
                                                        } else {
                                                            setFloatDetails([...floatDetails, detail]);
                                                        }
                                                    }}
                                                >
                                                    <View style={[styles.dot, selected && styles.filledDot]} />
                                                    <Text style={styles.checklistText}>{detail}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    <TouchableOpacity style={styles.nextButton} onPress={() => handleNext()}>
                                        <Text style={styles.nextButtonText}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {currentQuestion.type === "textInput" && (
                                <View style={styles.section}>
                                    <Text style={styles.inputLabel}>Optional Notes:</Text>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Describe anything unusual here..."
                                            multiline
                                            numberOfLines={4}
                                            onChangeText={setTextInputValue}
                                            value={textInputValue}
                                            returnKeyType="done"
                                            onSubmitEditing={Keyboard.dismiss}
                                        />
                                    </View>
                                    <TouchableOpacity style={styles.nextButton} onPress={() => handleNext(textInputValue)}>
                                        <Text style={styles.nextButtonText}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {currentIndex === 1 && !currentQuestion.type && (
                                <View style={styles.imageGrid}>
                                    {[
                                        { src: require('../assets/balls.png'), label: "Type 1", value: "Balls" },
                                        { src: require('../assets/hard.png'), label: "Type 2", value: "Hard" },
                                        { src: require('../assets/lumpy.png'), label: "Type 3", value: "Lumpy" },
                                        { src: require('../assets/normal.png'), label: "Type 4", value: "Normal" },
                                        { src: require('../assets/blobs.png'), label: "Type 5", value: "Blobs" },
                                        { src: require('../assets/fluffy.png'), label: "Type 6", value: "Fluffy" },
                                        { src: require('../assets/watery.png'), label: "Type 7", value: "Watery" },
                                        { src: require('../assets/pencil.png'), label: "Type 8", value: "Pencil Thin" },
                                    ].map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.imageBox}
                                            onPress={() => {
                                                console.log(`Selected: ${item.value}`);
                                                handleNext(item.value);
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.imageLabel}>{item.label}</Text>
                                            <Image source={item.src} style={styles.stoolImage} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {currentQuestion.options && currentIndex !== 1 && (
                                <>
                                    {currentQuestion.options.map((option, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.option}
                                            onPress={() => handleNext(option)}
                                        >
                                            <Text style={styles.optionText}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}

                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.screenIndicator}>
                <Text style={styles.screenIndicatorText}>
                    {currentIndex + 1} of {questions.length}
                </Text>
            </View>
        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'flex-start'
    },
    section: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 40,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        zIndex: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    question: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 140,
        textAlign: 'center',
        minHeight: 60,
        top: 140
    },
    question2: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 100,
        textAlign: 'center',
        minHeight: 60,
    },
    gradientBar: {
        width: '100%',
        height: 30,
        borderRadius: 15,
        marginBottom: 10,
        resizeMode: 'stretch',
        marginTop: 20
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    slider1: {
        width: '107%',
        height: 40,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginTop: 20,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 10,
        alignSelf: 'flex-start',
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
    nextButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 10,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    descriptionBox: {
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        width: '100%',
        minHeight: 100,
        maxHeight: 120,
    },
    descriptionText: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
        textAlign: 'left',
        lineHeight: 20
    },
    tickContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    },
    tick: {
        width: 2,
        height: 20,
        backgroundColor: '#000',
        marginBottom: 2,
    },
    tickLabel: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        marginTop: 2,
    },
    painButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
        width: '100%'
    },
    painButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#ddd'
    },
    activePainButton: {
        backgroundColor: '#aaa'
    },
    smellTrackLine: {
        height: 2,
        backgroundColor: '#000',
        width: '100%',
        position: 'absolute',
        top: 25,
        zIndex: 0,
    },
    painTrackLine: {
        height: 2,
        backgroundColor: '#000',
        width: '100%',
        position: 'absolute',
        top: 25,
        zIndex: 0,
    },
    tickArea: {
        width: '100%',
        position: 'relative',
        height: 60,
        justifyContent: 'center'
    },
    smellTicksRow: {
        position: 'absolute',
        top: 15,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        zIndex: 1,
        pointerEvents: 'none',
        height: 60,
    },
    painTicksRow: {
        position: 'absolute',
        top: 15,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        zIndex: 2,
        pointerEvents: 'none',
        height: 60,
    },
    floatToggleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        alignItems: 'center'
    },
    floatToggleButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeFloatToggle: {
        borderBottomColor: '#000',
    },
    floatToggleText: {
        fontSize: 18,
        color: '#888',
    },
    activeFloatToggleText: {
        color: '#000',
        fontWeight: 'bold'
    },
    optionsContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 8,
        width: '70%',
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#333',
        marginRight: 12,
        marginTop: 4,
    },
    filledDot: {
        backgroundColor: '#333',
    },
    checklistText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        flexWrap: 'wrap',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: -100,
    },
    imageBox: {
        width: '45%',
        marginVertical: 10,
        alignItems: 'center',
        padding: 4,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    imageLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    stoolImage: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    textInputWrapper: {
        width: '100%',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 20,
    },
    textInput: {
        height: 100,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#333',
    },
    startScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    startTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        top: -100,
    },
    startButton: {
        backgroundColor: '#000',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        top: -100
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    screenIndicator: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    screenIndicatorText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 5,
    },
});