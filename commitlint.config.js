module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'scope-empty': [2, 'never'],
		'body-leading-blank': [2, 'always'],
	},
	parserPreset: 'conventional-changelog-conventionalcommits',
	prompt: {
		settings: {},
		messages: {
			skip: ':건너 뛰려면 Enter를 누르세요',
			max: '최대 %d 글자를 입력해주세요',
			min: '최소 %d 글자를 입력해주세요',
			emptyWarning: '이 필드는 빈 값이 될 수 없습니다.',
			upperLimitWarning: '최대 제한된 글자 수 초과입니다.',
			lowerLimitWarning: '최소 제한된 글자 수 미만입니다.',
		},
		questions: {
			type: {
				description: '이번 커밋의 작업 타입을 선택해주세요:',
				enum: {
					feat: {
						description: '기능 (새로운 기능)',
						title: 'Features',
						emoji: '✨',
					},
					fix: {
						description: '버그 (버그 수정)',
						title: 'Bug Fixes',
						emoji: '🐛',
					},
					docs: {
						description: '문서 (예시 scope : README.md)',
						title: 'Documentation',
						emoji: '📚',
					},
					style: {
						description:
							'스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)',
						title: 'Styles',
						emoji: '💎',
					},
					refactor: {
						description:
							'리팩토링 (기능 추가 또는 버그 수정 없는 코드 개선 작업)',
						title: 'Code Refactoring',
						emoji: '📦',
					},
					perf: {
						description: '퍼포먼스 (기능의 변경 없이 성능 개선을 위한 작업)',
						title: 'Performance Improvements',
						emoji: '🚀',
					},
					test: {
						description:
							'테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)',
						title: 'Tests',
						emoji: '🚨',
					},
					ci: {
						description:
						'CI 에서 실행되는 작업 (Github Actions, Convention 등의 스코프)',
						title: 'Continuous Integrations',
						emoji: '⚙️',
					},
					chore: {
						description: '기타 변경사항 (예시 스코프: npm, githook 등)',
						title: 'Chores',
						emoji: '♻️',
					},
					revert: {
						description: '도르마무 (이전 커밋으로 되돌리는 작업)',
						title: 'Reverts',
						emoji: '🗑',
					},
					// build: {
					// 	description:
					// 		'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
					// 	title: 'Builds',
					// 	emoji: '🛠',
					// },
				},
			},
			scope: {
				description:
					'이번 변화의 영향 범위를 적어주세요 (e.g. component or file name)',
			},
			subject: {
				description:
					'이번 변화의 제목을 적어주세요 (e.g. fixed: broken feature)',
			},
			body: {
				description: '이번 변화의 상세 설명을 적어주세요',
			},
			isBreaking: {
				description: '이번 변화가 Major 버전을 변화시키는 작업인가요? (e.g version: 1.x.x → 2.0.0)',
			},
			breakingBody: {
				description:
					'이번 변화가 Major 버전을 변화시키는 작업이라면 상세 설명을 적어주세요',
			},
			breaking: {
				description: 'Describe the breaking changes',
			},
			isIssueAffected: {
				description: '이번 작업과 연결시킬 발행된 issue가 있나요?',
			},
			issuesBody: {
				description:
					'이번 커밋을 통해 이슈가 Close 된다면, 커밋의 상세내역을 적어주는게 좋습니다! (아까 안적으셨쥬~)',
			},
			issues: {
				description: '이슈 래퍼런스를 적어주세요 (e.g. "fix #123", "re #123".)',
			},
		},
	},
};
