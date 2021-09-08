/**
 * Events that can occur when the Outside module is active
 **/
Events.Outside = [
	{ /* Ruined traps */
	title: _('A Ruined Trap'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.buildings["trap"]', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					_('no traps have been torn apart.'),
					_('large prints lead away, into the forest.')
				],
				onLoad: function() {
					var numWrecked = Math.floor(Math.random() * $SM.get('game.buildings["trap"]', true)) + 1;
					$SM.add('game.buildings["trap"]', -numWrecked);
					Outside.updateVillage();
					Outside.updateTrapButton();
				},
				notification: _('no traps have been destroyed'),
				blink: true,
				buttons: {
					'track': {
						text: _('track them'),
						nextScene: {0.5: 'nothing', 1: 'catch'}
					},
					'ignore': {
						text: _('ignore them'),
						nextScene: 'end'
					}
				}
			},
			'nothing': {
				text: [
					_('the tracks disappear after just a few minutes.'),
					_('the forest is silent.')
				],
				notification: _('nothing was found'),
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			},
			'catch': {
				text: [
					_('not far from the village lies a large beast, its fur matted with blood.'),
					_('it puts up little resistance before the knife.')
				],
				notification: _('there was a beast. it\'s dead now'),
				reward: {
					fur: 1000,
					meat: 1000,
					teeth: 100
				},
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			}
		},
		audio: AudioLibrary.EVENT_RUINED_TRAP
	},
	{ /* Hut fire */
		title: _('Fire'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.buildings["hut"]', true) > 0 && $SM.get('game.population', true) > 50;
		},
		scenes: {
			'start': {
				text: [
					_('i removed fires from the game. you\'re welcome.'),
					_('no residents in the hut perished in the imaginary fire.')
				],
				notification: _('an imaginary fire has started'),
				blink: true,
				onLoad: function() {
					Outside.destroyHuts(0);
				},
				buttons: {
					'mourn': {
						text: _('thanks'),
						notification: _('no villagers have died'),
						nextScene: 'end'
					}
				}
			}
		},
		audio: AudioLibrary.EVENT_HUT_FIRE
	},
	{ /* Sickness */
		title: _('Sickness'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.population', true) > 10 && $SM.get('game.population', true) < 50 && $SM.get('stores.medicine', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					_('an imzginary sickness is spreading through the village.'),
					_('medicine is needed immediately. except you don\'t. i hacked it so it\'s free')
				],
				notification: _('no villagers are ill'),
				blink: true,
				buttons: {
					'heal': {
						text: _('1 medicine'),
						cost: { 'medicine' : 0 },
						nextScene: {1: 'healed'}
					},
					'ignore': {
						text: _('ignore it'),
						nextScene: {1: 'death'}
					}
				}
			},
			'healed': {
				text: [
					_('the imaginary sickness is cured in time.')
				],
				notification: _('sufferers are healed'),
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			},
			'death': {
				text: [
					_('you are a horrible human being. ten times as much death for you!'),
					_('the sickness spreads through the village.'),
					_('the days are spent with burials.'),
					_('the nights are rent with screams.')
				],
				notification: _('sufferers are left to die'),
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * Math.floor($SM.get('game.population', true)/2)) + 1;
					Outside.killVillagers(numKilled * 10);
				},
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			}
		},
		audio: AudioLibrary.EVENT_SICKNESS
	},

	{ /* Plague */
		title: _('Plague'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.population', true) > 50 && $SM.get('stores.medicine', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					_('an imaginary terrible plague is fast spreading through the village.'),
					_('medicine is needed immediately. except you don\'t. it\'s free now')
				],
				notification: _('an imaginary plague afflicts the village'),
				blink: true,
				buttons: {
					/* Because there is a serious need for medicine, the price is raised. */
					'buyMedicine': {
						text: _('buy medicine'),
						cost: { 'scales': 0,
								'teeth': 0 },
						reward: { 'medicine': 10 }
					},
					'heal': {
						text: _('5 medicine'),
						cost: { 'medicine' : 0 },
						nextScene: {1: 'healed'}
					},
					'ignore': {
						text: _('do nothing'),
						nextScene: {1: 'death'}
					}
				}
			},
			'healed': {
				text: [
					_('the imaginary plague is kept from spreading.'),
					_('no one dies.'),
					_('the villagers rejoice.')
				],
				notification: _('epidemic is eradicated instantly'),
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * 5) + 2;
					Outside.killVillagers(0);
				},
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			},
			'death': {
				text: [
					_('you are a horrible human being. ten times as much death for you!'),
					_('the plague rips through the village.'),
					_('the nights are rent with screams.'),
					_('the only hope is a quick death.')
				],
				notification: _('population is almost exterminated'),
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * 80) + 10;
					Outside.killVillagers(numKilled * 10);
				},
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			}
		},
		audio: AudioLibrary.EVENT_PLAGUE
	},

	{ /* Beast attack */
		title: _('A Beast Attack'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.population', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					 _('a pack of snarling beasts pours out of the trees.'),
					 _('the fight is short and bloody, but the beasts are repelled.'),
					 _('the villagers retreat to mourn the dead. except no one died.')
				],
				notification: _('wild beasts attack the villagers'),
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * 10) + 1;
					Outside.killVillagers(0);
				},
				reward: {
					fur: 1000,
					meat: 1000,
					teeth: 100
				},
				blink: true,
				buttons: {
					'end': {
						text: _('go home'),
						notification: _('predators stay predators'),
						nextScene: 'end'
					}
				}
			}
		},
		audio: AudioLibrary.EVENT_BEAST_ATTACK
	},

	{ /* Soldier attack */
		title: _('A Military Raid'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.population', true) > 0 && $SM.get('game.cityCleared');
		},
		scenes: {
			'start': {
				text: [
					_('a gunshot rings through the trees.'),
					_('well armed men charge out of the forest, firing into the crowd.'),
					_('after a skirmish they are driven away, and without losses.')
				],
				notification: _('troops storm the village'),
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * 40) + 1;
					Outside.killVillagers(0);
				},
				reward: {
					bullets: 100,
					'cured meat': 500
				},

				blink: true,
				buttons: {
					'end': {
						text: _('go home'),
						notification: _('warfare is bloodthirsty. you are a victor'),
						nextScene: 'end'
					}
				}
			}
		},
		audio: AudioLibrary.EVENT_SOLDIER_ATTACK
	}

];
