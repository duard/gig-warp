import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { questionService } from '../../questions/services/questionService';
import { answerService } from '../../answers/services/answerService';
import { answerTypeService } from '../../answer-types/services/answerTypeService';
import { Question } from '../../questions/types';
import { Answer } from '../../answers/types';
import { AnswerType } from '../../answer-types/types';

export default function AnswerQuestionScreen() {
  const { task_list_id, response_id } = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerTypes, setAnswerTypes] = useState<AnswerType[]>([]);
  const [existingAnswers, setExistingAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answersFormData, setAnswersFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedQuestions = await questionService.getAllQuestions();
        const filteredQuestions = fetchedQuestions.filter(q => q.task_list_id === task_list_id);
        setQuestions(filteredQuestions.sort((a, b) => a.order_index - b.order_index));

        const fetchedAnswerTypes = await answerTypeService.getAllAnswerTypes();
        setAnswerTypes(fetchedAnswerTypes);

        if (response_id) {
          const fetchedAnswers = await answerService.getAllAnswers();
          const filteredAnswers = fetchedAnswers.filter(a => a.response_id === response_id);
          setExistingAnswers(filteredAnswers);

          const initialFormData: Record<string, any> = {};
          filteredAnswers.forEach(answer => {
            initialFormData[answer.question_id] = answer.value;
          });
          setAnswersFormData(initialFormData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load questionnaire data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [task_list_id, response_id]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Questionnaire...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item: question }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question_text}</Text>
            {/* Placeholder for dynamic input based on answer_type_id and options */}
            <Text style={styles.answerType}>Answer Type: {answerTypes.find(at => at.id === question.answer_type_id)?.name}</Text>
            <Text style={styles.options}>Options: {JSON.stringify(question.options)}</Text>
            <Text>Current Answer: {JSON.stringify(answersFormData[question.id])}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answerType: {
    fontSize: 14,
    color: '#666',
  },
  options: {
    fontSize: 14,
    color: '#666',
  },
});