import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Star,
  Send,
  CheckCircle,
  Schedule,
  Person,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';

interface ReviewForm {
  goalRatings: Record<string, number>;
  competencyRatings: Record<string, number>;
  selfComments: string;
  achievements: string;
  challenges: string;
  developmentNeeds: string;
}

export default function ReviewCycle() {
  const [activeStep, setActiveStep] = useState(0);
  const [reviewType, setReviewType] = useState('self-review');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReviewForm>();

  const goals = [
    {
      id: '1',
      title: 'Increase Customer Satisfaction',
      description: 'Achieve 95% customer satisfaction rating',
      weight: 30,
      targetMetric: '95% satisfaction score',
      actualResult: '92% satisfaction score',
      evidence: ['Customer feedback reports', 'Survey results'],
    },
    {
      id: '2',
      title: 'Complete Technical Training',
      description: 'Finish advanced React certification',
      weight: 20,
      targetMetric: 'Certification with 80%+ score',
      actualResult: 'Completed with 85% score',
      evidence: ['Certificate', 'Training completion report'],
    },
    {
      id: '3',
      title: 'Lead Product Release',
      description: 'Deliver Q4 product release',
      weight: 40,
      targetMetric: 'On-time delivery with 90%+ quality',
      actualResult: 'Delivered 2 days early with 94% quality',
      evidence: ['Project completion report', 'Quality metrics'],
    },
  ];

  const competencies = [
    {
      id: '1',
      name: 'Technical Skills',
      description: 'Proficiency in required technical areas',
      weight: 25,
    },
    {
      id: '2',
      name: 'Communication',
      description: 'Effective verbal and written communication',
      weight: 20,
    },
    {
      id: '3',
      name: 'Problem Solving',
      description: 'Analytical thinking and solution development',
      weight: 25,
    },
    {
      id: '4',
      name: 'Collaboration',
      description: 'Teamwork and cross-functional cooperation',
      weight: 20,
    },
    {
      id: '5',
      name: 'Initiative',
      description: 'Proactive approach and ownership',
      weight: 10,
    },
  ];

  const reviewSteps = [
    'Goal Assessment',
    'Competency Evaluation',
    'Self Reflection',
    'Review Summary',
  ];

  const onSubmit = (data: ReviewForm) => {
    console.log('Review submission:', data);
    // Handle review submission
  };

  const calculateOverallScore = () => {
    const watchedData = watch();
    let totalScore = 0;
    let totalWeight = 0;

    // Goal scores
    goals.forEach(goal => {
      const rating = watchedData.goalRatings?.[goal.id] || 0;
      totalScore += rating * (goal.weight / 100);
      totalWeight += goal.weight / 100;
    });

    // Competency scores
    competencies.forEach(comp => {
      const rating = watchedData.competencyRatings?.[comp.id] || 0;
      totalScore += rating * (comp.weight / 100);
      totalWeight += comp.weight / 100;
    });

    return totalWeight > 0 ? (totalScore / totalWeight).toFixed(1) : '0.0';
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Rate Your Goal Achievement
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Evaluate how well you achieved each goal based on the defined metrics.
            </Typography>
            
            {goals.map((goal) => (
              <Card key={goal.id} variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {goal.title} ({goal.weight}% weight)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {goal.description}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight={500}>
                          Target: {goal.targetMetric}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          Result: {goal.actualResult}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight={500} gutterBottom>
                          Evidence:
                        </Typography>
                        {goal.evidence.map((item, index) => (
                          <Chip key={index} label={item} size="small" sx={{ mr: 1, mb: 1 }} />
                        ))}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" gutterBottom>
                          Self Rating
                        </Typography>
                        <Controller
                          name={`goalRatings.${goal.id}`}
                          control={control}
                          render={({ field }) => (
                            <Rating
                              {...field}
                              value={field.value || 0}
                              onChange={(_, value) => field.onChange(value)}
                              size="large"
                              precision={0.5}
                            />
                          )}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          1 = Below Expectations<br />
                          5 = Exceeds Expectations
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Competency Assessment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Rate your performance across key competencies.
            </Typography>
            
            {competencies.map((competency) => (
              <Card key={competency.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {competency.name} ({competency.weight}% weight)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {competency.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Controller
                          name={`competencyRatings.${competency.id}`}
                          control={control}
                          render={({ field }) => (
                            <Rating
                              {...field}
                              value={field.value || 0}
                              onChange={(_, value) => field.onChange(value)}
                              size="large"
                              precision={0.5}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Self Reflection
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="achievements"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      label="Key Achievements"
                      placeholder="Describe your major accomplishments this review period..."
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="challenges"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      label="Challenges Faced"
                      placeholder="What obstacles did you encounter and how did you address them?"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="developmentNeeds"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      label="Development Needs"
                      placeholder="What skills or knowledge areas would you like to develop?"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="selfComments"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      label="Additional Comments"
                      placeholder="Any other feedback or comments..."
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Summary
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Overall Score: {calculateOverallScore()}/5.0</strong>
              </Typography>
              <Typography variant="caption">
                This is your preliminary self-assessment score. Your manager will provide their evaluation.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Goal Ratings Summary
                </Typography>
                <List dense>
                  {goals.map((goal) => (
                    <ListItem key={goal.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={goal.title}
                        secondary={`Weight: ${goal.weight}%`}
                      />
                      <Rating
                        value={watch(`goalRatings.${goal.id}`) || 0}
                        readOnly
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Competency Ratings Summary
                </Typography>
                <List dense>
                  {competencies.map((comp) => (
                    <ListItem key={comp.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={comp.name}
                        secondary={`Weight: ${comp.weight}%`}
                      />
                      <Rating
                        value={watch(`competencyRatings.${comp.id}`) || 0}
                        readOnly
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Performance Review Cycle
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete your performance review for the current cycle
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Review Type</InputLabel>
          <Select
            value={reviewType}
            onChange={(e) => setReviewType(e.target.value)}
            label="Review Type"
          >
            <MenuItem value="self-review">Self Review</MenuItem>
            <MenuItem value="manager-review">Manager Review</MenuItem>
            <MenuItem value="360-review">360 Review</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {reviewSteps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={() => setActiveStep(activeStep - 1)}
                    >
                      Back
                    </Button>
                    
                    {activeStep === reviewSteps.length - 1 ? (
                      <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={handleSubmit(onSubmit)}
                      >
                        Submit Review
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(activeStep + 1)}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
    </Box>
  );
}