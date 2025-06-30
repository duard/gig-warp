import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { questionService } from '../../questions/services/questionService';
import { answerService } from '../../answers/services/answerService';
import { answerTypeService } from '../../answer-types/services/answerTypeService';
import { Question } from '../../questions/types';
import { Answer } from '../../answers/types';
import { AnswerType } from '../../answer-types/types';
import { responseService } from '../services/responseService'; // Import responseService
import SearchableSelect from '@/app/components/SearchableSelect';

// Accordion component
interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={accordionStyles.itemContainer}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={accordionStyles.header}>
        <Text style={accordionStyles.title}>{title}</Text>
        <FontAwesome name={expanded ? 'chevron-up' : 'chevron-down'} size={16} />
      </TouchableOpacity>
      {expanded && <View style={accordionStyles.content}>{children}</View>}
    </View>
  );
};

const accordionStyles = StyleSheet.create({
  itemContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
    backgroundColor: '#fff',
  },
});

// Dynamic Input Renderer
interface DynamicInputProps {
  question: Question;
  answerType: AnswerType | undefined;
  currentAnswer: any;
  onAnswerChange: (questionId: string, value: any) => void;
}

const DynamicInput: React.FC<DynamicInputProps> = ({ question, answerType, currentAnswer, onAnswerChange }) => {
  if (!answerType) {
    return <Text style={{ color: 'red' }}>Error: Unknown Answer Type</Text>;
  }

  switch (answerType.component_name) {
    case 'TextInput':
      return (
        <TextInput
          style={inputStyles.textInput}
          value={currentAnswer?.text || ''}
          onChangeText={(text) => onAnswerChange(question.id, { text })}
          placeholder="Enter your answer"
        />
      );
    case 'NumberInput':
      return (
        <TextInput
          style={inputStyles.textInput}
          value={currentAnswer?.number?.toString() || ''}
          onChangeText={(text) => onAnswerChange(question.id, { number: Number(text) })}
          keyboardType="numeric"
          placeholder="Enter a number"
        />
      );
    case 'BooleanToggle':
      return (
        <TouchableOpacity
          style={inputStyles.booleanToggle}
          onPress={() => onAnswerChange(question.id, { boolean: !(currentAnswer?.boolean) })}
        >
          <FontAwesome name={currentAnswer?.boolean ? 'check-square' : 'square-o'} size={24} color="#007AFF" />
          <Text style={inputStyles.booleanToggleText}>
            {currentAnswer?.boolean ? 'Yes' : 'No'}
          </Text>
        </TouchableOpacity>
      );
    case 'Dropdown':
      const dropdownOptions = question.options?.map((option: string) => ({ label: option, value: option })) || [];
      return (
        <SearchableSelect
          options={dropdownOptions}
          onSelect={(value) => onAnswerChange(question.id, { text: value })}
          selectedValue={currentAnswer?.text || ''}
          placeholder="Select an option"
        />
      );
    case 'RadioButtons':
      const radioOptions = question.options || [];
      return (
        <View style={inputStyles.radioContainer}>
          {radioOptions.map((option: string) => (
            <TouchableOpacity
              key={option}
              style={inputStyles.radioOption}
              onPress={() => onAnswerChange(question.id, { text: option })}
            >
              <FontAwesome
                name={currentAnswer?.text === option ? 'dot-circle-o' : 'circle-o'}
                size={20}
                color="#007AFF"
              />
              <Text style={inputStyles.radioOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    case 'CheckboxGroup':
      const checkboxOptions = question.options || [];
      const selectedCheckboxes = currentAnswer?.array || [];
      return (
        <View style={inputStyles.checkboxContainer}>
          {checkboxOptions.map((option: string) => (
            <TouchableOpacity
              key={option}
              style={inputStyles.checkboxOption}
              onPress={() => {
                const newSelection = selectedCheckboxes.includes(option)
                  ? selectedCheckboxes.filter((item: string) => item !== option)
                  : [...selectedCheckboxes, option];
                onAnswerChange(question.id, { array: newSelection });
              }}
            >
              <FontAwesome
                name={selectedCheckboxes.includes(option) ? 'check-square' : 'square-o'}
                size={20}
                color="#007AFF"
              />
              <Text style={inputStyles.checkboxOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    default:
      return (
        <TextInput
          style={inputStyles.textInput}
          value={currentAnswer?.text || ''}
          onChangeText={(text) => onAnswerChange(question.id, { text })}
          placeholder={`Input for ${answerType.name}`}
        />
      );
  }
};

const inputStyles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  booleanToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  booleanToggleText: {
    marginLeft: 10,
    fontSize: 16,
  },
  radioContainer: {
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOptionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  checkboxContainer: {
    marginBottom: 10,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxOptionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});


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

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswersFormData(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitAnswers = async () => {
    try {
      if (!response_id) {
        Alert.alert('Error', 'Response ID is missing. Cannot save answers.');
        return;
      }

      for (const question of questions) {
        const answerValue = answersFormData[question.id];
        if (question.is_required && !answerValue) {
          Alert.alert('Validation Error', `Question "${question.question_text}" is required.`);
          return;
        }

        const existingAnswer = existingAnswers.find(a => a.question_id === question.id);

        if (existingAnswer) {
          await answerService.updateAnswer(existingAnswer.id, { value: answerValue });
        } else if (answerValue) {
          await answerService.createAnswer({
            response_id: response_id as string,
            question_id: question.id,
            value: answerValue,
            status_id: question.default_status_id, // Use default status from question
            started_at: new Date().toISOString(), // Set started_at for new answers
            is_active: true,
            // created_by, updated_by, deleted_by would be handled by RLS or a global context
          });
        }
      }
      Alert.alert('Success', 'Answers saved successfully!');
      // Optionally navigate back or to a confirmation screen
      router.back();
    } catch (error) {
      console.error('Error saving answers:', error);
      Alert.alert('Error', 'Failed to save answers.');
    }
  };

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
          <AccordionItem title={question.question_text}>
            <Text style={styles.questionDescription}>{question.description}</Text>
            <DynamicInput
              question={question}
              answerType={answerTypes.find(at => at.id === question.answer_type_id)}
              currentAnswer={answersFormData[question.id]}
              onAnswerChange={handleAnswerChange}
            />
          </AccordionItem>
        )}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAnswers}>
        <Text style={styles.submitButtonText}>Submit Answers</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  answerType: {
    fontSize: 14,
    color: '#666',
  },
  options: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
